import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { StepsList } from '../components/StepsList';
import { FileExplorer } from '../components/FileExplorer';
import { TabView } from '../components/TabView';
import { CodeEditor } from '../components/CodeEditor';
import { PreviewFrame } from '../components/PreviewFrame';
import { Step, FileItem, StepType } from '../types';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { parseXml } from '../steps';
import { useWebContainer } from '../hooks/useWebContainer';
import { FileNode } from '@webcontainer/api';
import { Loader } from '../components/Loader';
import { processFiles } from '../pages/Wrapper';


const MOCK_FILE_CONTENT = `// This is a sample file content
import React from 'react';

function Component() {
  return <div>Hello World</div>;
}

export default Component;`;

export function Builder() {
  const location = useLocation();
  const { prompt } = location.state as { prompt: string }; // made here changes
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{ role: "user" | "assistant", content: string; }[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const webcontainer = useWebContainer();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  // const [steps, setSteps] = useState<Step[]>([]);
  // const [files, setFiles] = useState<FileItem[]>([]);

  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: 'Initialize Project',
      description: 'Set up the project folder structure',
      type: 'CreateFolder',
      status: 'completed',
    },
  ]);

  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const projectId = '6799f9fea07c7eede4a0c823'; // Replace with dynamic project ID
        const response = await axios.get(`${BACKEND_URL}/project/getAllFiles`, {
          params: { projectId }, 
        });
        console.log('Fetched files:', response.data.files);

        setFiles(response.data.files); 
      } catch (error) {
        console.error('Error fetching files:', error);
      }
      
    };

    fetchFiles();
  }, []);

  //making all files editable------------------>>>>>>>>
  // Use a ref to track the last processed files
  const lastProcessedFilesRef = useRef<FileItem[] | null>(null);

  useEffect(() => {
    // Prevent infinite loop by checking if files are already processed
    const processedFiles = processFiles(files);

    if (
      JSON.stringify(processedFiles) !== JSON.stringify(lastProcessedFilesRef.current)
    ) {
      console.log('Processing files:', files);
      console.log('Processed Files:', processedFiles);

      // Update the ref and state
      lastProcessedFilesRef.current = processedFiles;
      setFiles(processedFiles);
    }
  }, [files]); // Only run when files change


  // Ref to store the previous state of files
  const prevFilesRef = useRef<FileItem[]>(files);
  console.log("prevFilesRef", prevFilesRef);

  useEffect(() => {
    const prevFiles = prevFilesRef.current;

    // Identify added and updated files
    const addedFiles = files.filter(
      (currentFile) => !prevFiles.some((prevFile) => prevFile.path === currentFile.path)
    );

    const updatedFiles = files.filter((currentFile) => {
      const matchingPrevFile = prevFiles.find((prevFile) => prevFile.path === currentFile.path);
      return matchingPrevFile && matchingPrevFile.content !== currentFile.content;
    });

    // Call the backend for added files
    addedFiles.forEach(async (file) => {
      console.log("file", file);
      try {
        await axios.post(`${BACKEND_URL}/project/uploadFile`, 
          {
            projectId: '6799ff6e0c1d7a9c8b557039',
            name: file.name,
            path: file.path,
            content: file.content,
            type: file.type,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        console.log(`Added file: ${file.path}`);
      } catch (error) {
        console.error(`Error adding file: ${file.path}`, error);
      }
    });

    // Call the backend for updated files
    updatedFiles.forEach(async (file) => {
      try {
        await axios.put(`${BACKEND_URL}/project/updateFile`, {
          projectId: '6799ff6e0c1d7a9c8b557039',
          path: file.path,
          content: file.content,
        });
        console.log(`Updated file: ${file.path}`);
      } catch (error) {
        console.error(`Error updating file: ${file.path}`, error);
      }
    });

    // Update the ref after processing changes
    prevFilesRef.current = files;
  }, [files]);


  //Folder Structure handled 
  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;

    steps.filter(({ status }) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
        let currentFileStructure = [...originalFiles]; // {}
        const finalAnswerRef = currentFileStructure;

        let currentFolder = "";

        while (parsedPath.length) {
          currentFolder = `${currentFolder}/${parsedPath[0]}`;
          const currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);

          if (!parsedPath.length) {
            // final file
            const file = currentFileStructure.find(x => x.path === currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            /// in a folder
            const folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              // create the folder
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }

            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }

    })

    if (updateHappened) {

      setFiles(originalFiles)
      setSteps(steps => steps.map((s: Step) => {
        return {
          ...s,
          status: "completed"
        }

      }))
    }
    console.log(files);
    console.log(steps);

  }, [steps, files]);


  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};

      const processFile = (file: FileItem, isRootFolder: boolean) => {
        if (file.type === 'folder') {
          // For folders, create a directory entry
          mountStructure[file.name] = {
            directory: file.children ?
              Object.fromEntries(
                file.children.map(child => [child.name, processFile(child, false)])
              )
              : {}
          };
        } else if (file.type === 'file') {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || ''
              }
            };
          } else {
            // For files, create a file entry with contents
            return {
              file: {
                contents: file.content || ''
              }
            };
          }
        }

        return mountStructure[file.name];
      };

      // Process each top-level file/folder
      files.forEach(file => processFile(file, true));

      return mountStructure;
    };

    const mountStructure = createMountStructure(files);

    // Mount the structure if WebContainer is available
    console.log(mountStructure);
    webcontainer?.mount(mountStructure);
  }, [files, webcontainer]);

  /////init function
  /////init function
  /////init function

  async function init() {
    const response = await axios.post(`${BACKEND_URL}/template`, {
      prompt: prompt.trim()
    });
    setTemplateSet(true);

    const { prompts, uiPrompts } = response.data;

    //parsing all UI prompt in proper fromat 
    //setting up steps 
    setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
      ...x,
      status: "pending"
    })));

    console.log("hello all steps are here: ", steps);

    setLoading(true);

    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, prompt].map(content => ({
        role: "user",
        content
      }))
    })

    setLoading(false);

    // setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
    //   ...x,
    //   status: "pending" as "pending"
    // }))]);
    // console.log("new stpes" , steps);

    setSteps((prevSteps) => {
      const lastStepId = prevSteps.length > 0 ? Math.max(...prevSteps.map(step => step.id)) : 0;
      const newSteps = parseXml(stepsResponse.data.response, lastStepId + 1); // Start from last used id + 1
      return [...prevSteps, ...newSteps.map(x => ({
        ...x,
        status: "pending" as "pending"
      }))];
    });

    console.log("new steps", steps);


    setLlmMessages([...prompts, prompt].map(content => ({
      role: "user",
      content
    })));

    setLlmMessages(x => [...x, { role: "assistant", content: stepsResponse.data.response }])
  }

  // useEffect(() => {
  //   init();
  // }, [])

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-100">Website Builder</h1>
        <p className="text-sm text-gray-400 mt-1">Prompt: {prompt}</p>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-4 gap-6 p-6">
          <div className="col-span-1 space-y-6 overflow-auto">
            <div>
              <div className="max-h-[75vh] overflow-scroll">
                <StepsList
                  steps={steps}
                  currentStep={currentStep}
                  onStepClick={setCurrentStep}
                />
              </div>
              <div>
                <div className='flex'>
                  <br />
                  {(loading || !templateSet) && <Loader />}
                  {!(loading || !templateSet) && <div className='flex'>
                    <textarea value={userPrompt} onChange={(e) => {
                      setPrompt(e.target.value)
                    }} className='p-2 w-full'></textarea>
                    <button onClick={async () => {
                      const newMessage = {
                        role: "user" as "user",
                        content: userPrompt
                      };

                      setLoading(true);
                      const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
                        messages: [...llmMessages, newMessage]
                      });
                      setLoading(false);

                      setLlmMessages(x => [...x, newMessage]);
                      setLlmMessages(x => [...x, {
                        role: "assistant",
                        content: stepsResponse.data.response
                      }]);

                      setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
                        ...x,
                        status: "pending" as "pending"
                      }))]);

                    }} className='bg-purple-400 px-4'>Send</button>
                  </div>}
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <FileExplorer
              files={files}
              onFileSelect={setSelectedFile}
            />
          </div>
          <div className="col-span-2 bg-gray-900 rounded-lg shadow-lg p-4 h-[calc(100vh-8rem)]">
            <TabView activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="h-[calc(100%-4rem)]">
              {activeTab === 'code' ? (
                <CodeEditor file={selectedFile} />
              ) : (
                <PreviewFrame webContainer={webcontainer} files={files} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}