# Copy File for Chat

This Visual Studio Code extension allows you to copy the content of a file or an entire directory to your clipboard or directly to copilot.

## Features

- Copy the content of a file to your clipboard, formatted for pasting into a chat window
- Integrates with the context menu in the Explorer view

## Usage

Two commands are provided:

### Copy File Contents to Clipboard/Copilot

1. Right-click on the file in the Explorer view
2. Select "Copy Directory/File Content with Context" from the context menu
3. The formatted content will be pasted into your chat window

You can also use the command palette to run the "Copy Directory/File Content with Context" command.

### Copy Directory Contents to Clipboard/Copilot

1. Right-click on the directory in the Explorer view
2. Select "Copy Directory Contents to Copilot/Clipboard" from the context menu

The formatted content of all files in the directory will be pasted into your chat window. It will follow 
the .gitignore rules for the directory, so you can exclude files from being copied by adding them to the .gitignore file.

The extension will also look for a .copilotignore file in the directory tree, and also use that to ignore files.

## Requirements

- Visual Studio Code 1.78.0 or higher

## Extension Settings

This extension does not contribute any settings.

## Known Issues

None.

## Issues

https://github.com/mikeedjones/copy-file-to-chat/issues

## License

This extension is licensed under the [MIT License](LICENSE).