const fs = require('fs');
const path = require('path');

const walkDir = (dir, callback) => {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
};

const replaceColors = (filePath) => {
  if (!filePath.endsWith('.jsx') && !filePath.endsWith('.js')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Gradients
  content = content.replace(/linear-gradient\(135deg,#ed7aaa,#7c4fe0\)/g, 'linear-gradient(135deg, #FF0F9B, #C4009A)');
  content = content.replace(/linear-gradient\(135deg,#fef7f9,#f5f2ff\)/g, 'linear-gradient(135deg, #FDF6FA, #FDF6FA)');
  content = content.replace(/linear-gradient\(135deg,#fdeef3,#ede8ff\)/g, 'linear-gradient(135deg, #FDF6FA, #F6B1D5)');
  content = content.replace(/linear-gradient\(135deg,#fad5e4,#d6ccfc\)/g, 'linear-gradient(135deg, #F6B1D5, #F6B1D5)');

  // Main colors
  content = content.replace(/#7c4fe0/g, '#FF0F9B'); // Primary
  content = content.replace(/#ed7aaa/g, '#E600A8'); // Secondary
  content = content.replace(/#9575f0/g, '#C4009A'); // Accent
  content = content.replace(/#6335c8/g, '#C4009A'); // Accent
  content = content.replace(/#e2508e/g, '#E600A8'); // Secondary

  // Backgrounds
  content = content.replace(/#fdeef3/g, '#FDF6FA'); // Light background
  content = content.replace(/#fef7f9/g, '#FDF6FA'); // Light background
  content = content.replace(/#f5f2ff/g, '#FDF6FA'); // Light background
  content = content.replace(/#ede8ff/g, '#F6B1D5'); // Soft background
  content = content.replace(/#fad5e4/g, '#F6B1D5'); // Soft background
  content = content.replace(/#d6ccfc/g, '#F6B1D5'); // Soft background
  content = content.replace(/#f2f0f4/g, '#FDF6FA'); // Light background (grayish originally)
  content = content.replace(/#f5adc8/g, '#F6B1D5'); 

  // Text colors
  content = content.replace(/#1c1828/g, '#1A1A1A'); // Text
  content = content.replace(/#3d3748/g, '#1A1A1A'); // Text
  content = content.replace(/#706880/g, '#1A1A1A'); // Text
  content = content.replace(/#a09ab0/g, '#1A1A1A'); // Text
  content = content.replace(/#ccc5d6/g, '#1A1A1A'); // Text
  content = content.replace(/#b8a6f8/g, '#1A1A1A'); // Text

  fs.writeFileSync(filePath, content, 'utf8');
};

walkDir(path.join(__dirname, 'src'), replaceColors);
console.log("Colors replaced in js/jsx files.");
