// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	//console.log('Congratulations, your extension "cupper" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	//const disposable = vscode.commands.registerCommand('cupper.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
	//	vscode.window.showInformationMessage('Hello World from COBOL-UPPERCASE!');
	
	const cobolKeywords = [
		"ADD", "CALL", "CLOSE", "COMPUTE", "DELETE", "DISPLAY", "DIVIDE", 
		"EVALUATE", "EXIT", "IF", "MOVE", "PERFORM", "READ", "REWRITE", 
		"RETURN", "SELECT", "SEND", "SUBTRACT", "THROUGH", "WRITE"
		// Weitere Schlüsselwörter hinzufügen
	];
	 
	let disposable = vscode.commands.registerCommand('cupper.convertCobolKeywords', () => {
		const editor = vscode.window.activeTextEditor;
	 
		if (editor) {
			const document = editor.document;
			const edit = new vscode.WorkspaceEdit();
	 
			for (let line = 0; line < document.lineCount; line++) {
				const text = document.lineAt(line).text;
				let modifiedText = text;
	 
				cobolKeywords.forEach(keyword => {
					const regex = new RegExp(`\\b${keyword}\\b`, 'g');
					modifiedText = modifiedText.replace(regex, keyword.toUpperCase());
				});
	 
				if (modifiedText !== text) {
					edit.replace(document.uri, document.lineAt(line).range, modifiedText);
				}
			}
	 
			return vscode.workspace.applyEdit(edit).then(success => {
				if (success) {
					vscode.window.showInformationMessage('Cobol Schlüsselwörter wurden in Großbuchstaben umgewandelt!');
				}
			});
		}
	});
	 
	context.subscriptions.push(disposable);
//	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
