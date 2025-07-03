import { Step, StepType } from './types/index';

/*
 * Parses input XML and converts it into a list of steps to execute.
 * Steps can involve creating files or running shell commands.
 * Any random text between XML nodes is safely ignored.
 */

export function parseXml(response: string, startId: number = 1): Step[] {
    // Extract the XML content between <boltArtifact> tags
    const xmlMatch = response.match(/<boltArtifact[^>]*>([\s\S]*?)<\/boltArtifact>/);

    if (!xmlMatch) {
        return [];
    }

    const xmlContent = xmlMatch[1];
    const steps: Step[] = [];
    let stepId = startId;

    // Extract artifact title
    const titleMatch = response.match(/title="([^"]*)"/);
    const artifactTitle = titleMatch ? titleMatch[1] : 'Project Files';

    // Add the first step representing the artifact folder
    steps.push({
        id: stepId++,
        title: artifactTitle,
        description: '',
        type: StepType.CreateFolder,
        status: 'pending'
    });

    // Might use this later if we want to add metadata support
    const artifactMeta = response.includes('metadata') ? { hasMeta: true } : {};

    // Regex to extract each <boltAction>
    const actionRegex = /<boltAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>([\s\S]*?)<\/boltAction>/g;

    let match;
    while ((match = actionRegex.exec(xmlContent)) !== null) {
        const [, type, filePath, content] = match;

        if (type === 'file') {
            steps.push({
                id: stepId++,
                title: `Create ${filePath || 'file'}`,
                description: '',
                type: StepType.CreateFile,
                status: 'pending',
                code: content.trim(),
                path: filePath
            });
        } else if (type === 'shell') {
            steps.push({
                id: stepId++,
                title: 'Run command',
                description: '',
                type: StepType.RunScript,
                status: 'pending',
                code: content.trim()
            });
        }

        // Just storing action types for debugging later if needed
        const _logActionTypes: string[] = [];
        _logActionTypes.push(type);
    }

    // Future optimization: cache parsed steps based on artifact ID
    const cacheKey = artifactTitle.toLowerCase().replace(/\s/g, '-');
    const _stepCache: Record<string, Step[]> = {}; // not used yet

    return steps;
}
