import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import ignore from 'ignore';

async function copyFile(uri: vscode.Uri) {
  let content = await vscode.workspace.fs.readFile(uri);

  let filePath = vscode.workspace.asRelativePath(uri);
  let projectName = vscode.workspace.name || "Unknown";
  let fileExtension = path.extname(uri.fsPath).slice(1);

  return `
===============================
Project Name: '${projectName}'
File Path: '${filePath}'
File Content:
\`\`\`${fileExtension}
${content}
\`\`\`
===============================
`;
}

async function shouldIgnoreFile(fileUri: vscode.Uri) {
    let relativePath = vscode.workspace.asRelativePath(fileUri);
    let directories = fileUri.fsPath.split(path.sep);
    
    let repoRoot;
    for (let i = 0; i < directories.length; i++) {
      let dirPath = directories.slice(0, i + 1).join(path.sep);
      let gitUri = vscode.Uri.joinPath(vscode.Uri.file(dirPath), ".git");
      
      // Check if we found the repo root
      try {
        // Check if we found the repo root
        let stat = await vscode.workspace.fs.stat(gitUri);
        if (stat.type === vscode.FileType.Directory) {
          repoRoot = dirPath;
          break;  
        }
      } catch (err) {
        // Ignore - .git folder does not exist, continue traversing up
      }
    }
    
    for (let i = 0; i < directories.length && directories[i] !== repoRoot; i++) {
      let dirPath = directories.slice(0, i + 1).join(path.sep);
      let gitignoreUri = vscode.Uri.joinPath(vscode.Uri.file(dirPath), ".gitignore");
      let copilotignoreUri = vscode.Uri.joinPath(vscode.Uri.file(dirPath), ".copilotignore");
      const ig = ignore().add(['.abc/*', '!.abc/d/'])
      try {
        let gitignoreContent = await vscode.workspace.fs.readFile(gitignoreUri);
        let igGit = ignore().add(gitignoreContent.toString().split("\n"));{
        if (igGit.ignores(relativePath)) {
          return true;
        }
        }
        let copilotignoreContent = await vscode.workspace.fs.readFile(copilotignoreUri);
        let igCoPilot = ignore().add(copilotignoreContent.toString().split("\n"));{
          if (igCoPilot.ignores(relativePath)) {
            return true;
          }
        }
      } catch (err) {}
    }
    
    return false;
  }

async function readDirectoryRecursive(uri: vscode.Uri): Promise<vscode.Uri[]> {
    let files = await vscode.workspace.fs.readDirectory(uri);
    let fileUris: vscode.Uri[] = [];
  
    // Read the .gitignore file if it exists
    let gitignoreUri = vscode.Uri.joinPath(uri, ".gitignore");
    let gitignore: string[] = [];
    try {
      let gitignoreContent = await vscode.workspace.fs.readFile(gitignoreUri);
      gitignore = gitignoreContent.toString().split("\n");
    } catch (err) {}
  
    for (let [fileName, fileType] of files) {
      let fileUri = vscode.Uri.joinPath(uri, fileName);
      let relativePath = vscode.workspace.asRelativePath(fileUri);
  
      // Check if the file should be ignored
      let ignore = await shouldIgnoreFile(fileUri);
      if (ignore) {
        continue;
      }
  
      if (fileType === vscode.FileType.Directory) {
        let subDirectoryFiles = await readDirectoryRecursive(fileUri);
        fileUris.push(...subDirectoryFiles);
      } else if (fileType === vscode.FileType.File) {
        fileUris.push(fileUri);
      }
    }
  
    return fileUris;
  }

async function copyDirectory(uri: vscode.Uri) {
  let directoryPath = vscode.workspace.asRelativePath(uri);
  let projectName = vscode.workspace.name || "Unknown";

  let toCopy = `
===============================
Project Name: '${projectName}'
Directory Path: '${directoryPath}'
===============================
`;

  let fileUris = await readDirectoryRecursive(uri);
  for (let fileUri of fileUris) {
    toCopy += await copyFile(fileUri);
  }

  return toCopy;
}

export function activate(context: vscode.ExtensionContext) {
  let disposableFile = vscode.commands.registerCommand(
    "extension.sendSelectedFileContent",
    async (uri: vscode.Uri) => {
        let toCopy = await copyFile(uri);
        await vscode.env.clipboard.writeText(toCopy);
        await vscode.commands.executeCommand("workbench.panel.interactiveSession.view.copilot.focus");
        vscode.commands.executeCommand('editor.action.clipboardPasteAction');
    }
  );

  let disposableDirectory = vscode.commands.registerCommand(
    "extension.sendSelectedDirectoryContent",
    async (uri: vscode.Uri) => {
        let toCopy = await copyDirectory(uri);
        await vscode.env.clipboard.writeText(toCopy);
        await vscode.commands.executeCommand("workbench.panel.interactiveSession.view.copilot.focus");
        vscode.commands.executeCommand('editor.action.clipboardPasteAction');
    }
  );

  context.subscriptions.push(disposableFile, disposableDirectory);
}

export function deactivate() {}