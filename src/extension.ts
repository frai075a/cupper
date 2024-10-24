import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('cupper.convertCobolKeywords', () => {
		const editor = vscode.window.activeTextEditor;
	 
		if (editor) {
			const document = editor.document;
			const edit = new vscode.WorkspaceEdit();
	 
			for (let line = 0; line < document.lineCount; line++) {
				const text = document.lineAt(line).text;
                //ignoriere Kommentarzeilen
				if (text.substring(6,7) != '*') {
					var modifiedText = text;
					//überprüfe, ob im Code eine Stringzuweisung erfolgt. Falls nicht (= -1)
					//kann die ganze Zeile geuppercased werden
					if (modifiedText.indexOf("'") < 0 && modifiedText.indexOf("\"") <0) {
						modifiedText = modifiedText.toUpperCase();
					}
					else {
						if (modifiedText.indexOf("'") < 0) {
							// dann sind doppelte Hochkommata die Delimiter
							var strStart = modifiedText.indexOf("\"") - 1;
							var strEnde = modifiedText.indexOf("\"", strStart+2);
						}
						else {
							// dann sind einfache Hochkommata die Delimiter
							var strStart = modifiedText.indexOf("'") - 1;
							var strEnde = modifiedText.indexOf("'", strStart+2);
						}
						// Großschreibung nur für die Teile des Strings, die außerhalb der Delimiter sind
						const changedText = modifiedText.substring(0, strStart).toUpperCase() +
						                    modifiedText.substring(strStart+1, strEnde) +
						                    modifiedText.substring(strEnde).toUpperCase();
						modifiedText = changedText;
					}
					if (modifiedText !== text) {
						edit.replace(document.uri, document.lineAt(line).range, modifiedText);
					}
				}
				
			}
	 
			return vscode.workspace.applyEdit(edit).then(success => {
				if (success) {
					console.log('Cobol Source wurden in Großbuchstaben umgewandelt!');
				}
			});
		
		}
		
	});
	context.subscriptions.push(disposable);
}