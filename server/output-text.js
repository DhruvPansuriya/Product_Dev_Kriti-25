export const outputData = { text : `\`\`\`xml
<boltArtifact id="project-import" title="Project Files">

<boltAction type="file" filePath="src/App.js">
\`\`\`javascript
/* eslint-disable react/jsx-pascal-case */
import './App.css';
import { LucideSun, LucideMoon } from 'lucide-react';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Blog</h1>
        <div>
          <LucideSun className="h-6 w-6 cursor-pointer"/>
          <LucideMoon className="h-6 w-6 cursor-pointer"/>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <article className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-xl font-bold mb-2">Blog Post Title 1</h2>
          <img src="https://images.unsplash.com/photo-1676642746666-66560666665a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fGJsb2d8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60" alt="Blog Post Image" className="w-full mb-4 rounded-lg"/>
          <p className="text-gray-700">This is a sample blog post.  You can write your content here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </article>
        <article className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-xl font-bold mb-2">Blog Post Title 2</h2>
          <img src="https://images.unsplash.com/photo-1517694712202-14dd9fa29b1a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmxvZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60" alt="Blog Post Image" className="w-full mb-4 rounded-lg"/>
          <p className="text-gray-700">This is another sample blog post.  You can write your content here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </article>
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        &copy; 2024 My Blog
      </footer>
    </div>
  );
}

export default App;
\`\`\`
</boltAction>

<boltAction type="file" filePath="src/App.css">
\`\`\`css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* General styling */
body {
  margin: 0;
  font-family: 'Arial', sans-serif;
}

.container {
  max-width: 960px;
}

article {
  margin-bottom: 2rem;
}

article img {
  border-radius: 0.5rem;
}
\`\`\`
</boltAction>

</boltArtifact>
\`\`\`
` };
