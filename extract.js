const fs = require('fs');
const path = require('path');

try {
  const data = JSON.parse(fs.readFileSync('banani_ui.json', 'utf8'));
  const content = data.result.content;
  
  if (content && content.length > 0) {
    const text = content[0].text;
    const innerData = JSON.parse(text);
    
    const outputDir = path.join(__dirname, 'frontend', 'client', 'src', 'banani_ui');
    
    if (innerData.designs) {
      for (const design of innerData.designs) {
        let fileName = design.screenId.split('/').pop();
        fs.writeFileSync(path.join(outputDir, fileName), design.source || design.content);
        console.log(`Wrote screen ${fileName}`);
      }
    }
    
    if (innerData.sharedFiles) {
      if (innerData.sharedFiles.length > 0) {
         console.log("Keys of first shared file:", Object.keys(innerData.sharedFiles[0]));
      }
      for (const file of innerData.sharedFiles) {
        let cleanPath = (file.path || file.name || "unknown").replace(/^@/, '');
        let fileContent = file.source || file.content || file.code || "";
        if (!fileContent) {
           fileContent = JSON.stringify(file, null, 2);
        }
        
        const fullPath = path.join(outputDir, cleanPath);
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        
        fs.writeFileSync(fullPath, fileContent);
        console.log(`Wrote shared file ${cleanPath}`);
      }
    }
  }
} catch (e) {
  console.error(e);
}
