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
							var strStart = modifiedText.indexOf("\"", 7);
							var strEnde = modifiedText.indexOf("\"", strStart+2);
							if (strEnde < 1) {
								//gibt es keine schließende Hochkommata, wird das Literal in der nächsten Zeile fortgesetzt.
								//Damit der Prozess sauber funktioniert, wird von einem Abschluss an Pos 72 ausgegangen.
								strEnde = 71;
							}
						}
						else {
							// dann sind einfache Hochkommata die Delimiter
							var strStart = modifiedText.indexOf("'", 7);
							var strEnde = modifiedText.indexOf("'", strStart+2);
							if (strEnde < 1) {
								//gibt es keine schließende Hochkommata, wird das Literal in der nächsten Zeile fortgesetzt.
								//Damit der Prozess sauber funktioniert, wird von einem Abschluss an Pos 72 ausgegangen.
								strEnde = 71;
							}

						}
						// Großschreibung nur für die Teile des Strings, die außerhalb der Delimiter sind
						// Inhalte der Spalte 1-7 bleiben unberührt
                        const changedText = modifiedText.substring(0, 7) +
						    				modifiedText.substring(7, strStart).toUpperCase() +
                            				modifiedText.substring(strStart, strEnde+1) +
                            				modifiedText.substring(strEnde+1).toUpperCase()
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