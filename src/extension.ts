import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    // Register a command to send the content of the selected file to this chat window
    let disposable = vscode.commands.registerCommand('copy-file-for-chat.sendSelectedFileContent', () => {
        // Get the active editor
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        // Get the selected file path
        let filePath = editor.document.uri.fsPath;

        // Read the content of the selected file
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                vscode.window.showErrorMessage(`Failed to read file: ${err.message}`);
                return;
            }

            // Get the workspace folder that contains the selected file
			if (!editor) {
				return; // No open text editor
			}
            let workspaceFolder = vscode.workspace.getWorkspaceFolder(editor.document.uri);
            if (!workspaceFolder) {
                vscode.window.showErrorMessage('Failed to get workspace folder');
                return;
            }

            // Get the relative path of the selected file within the workspace folder
            let relativePath = vscode.workspace.asRelativePath(filePath);

            // Format the message to include the file path and content
            let message = `Content of \`${relativePath}\`:\n\`\`\`\n${data}\n\`\`\``;

            // Send the message to this chat window
            vscode.env.clipboard.writeText(message);
            vscode.commands.executeCommand("workbench.panel.interactiveSession.view.copilot.focus");
            vscode.commands.executeCommand('editor.action.clipboardPasteAction');
        });
    });

    // Add the command to the context menu
    context.subscriptions.push(disposable);
}

export function deactivate() {}