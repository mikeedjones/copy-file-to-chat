# Copy File for Chat

This Visual Studio Code extension allows you to copy the content of a file to your clipboard, formatted for pasting into the chat window.

## Features

- Copy the content of a file to your clipboard, formatted for pasting into a chat window
- Integrates with the context menu in the Explorer view

## Usage

Two commands are provided:

### Copy File Contents to chat

1. Right-click on the file in the Explorer view
2. Select "Copy File Contents to chat" from the context menu
3. The formatted content will be pasted into your chat window

You can also use the command palette to run the "Copy File Contents to chat" command.

### Copy Directory Contents to chat

1. Right-click on the directory in the Explorer view
2. Select "Copy Directory Contents to chat" from the context menu

The formatted content of all files in the directory will be pasted into your chat window. It will follow 
the .gitignore rules for the directory, so you can exclude files from being copied by adding them to the .gitignore file.

## Requirements

- Visual Studio Code 1.78.0 or higher

## Extension Settings

This extension does not contribute any settings.

## Known Issues

None.

## Release Notes

### 0.0.1

Initial release of Copy File for Chat.

## License

This extension is licensed under the [MIT License](LICENSE).