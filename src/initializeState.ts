import * as vscode from 'vscode';
import { IState } from './types';
import path from 'path';
import { getFileContent } from './utils';

export const initializeState = async (editor: vscode.TextEditor, workspaceFolder: vscode.WorkspaceFolder): Promise<IState> => {
	const fullFilePath = editor.document.uri.fsPath;
	const workspaceFolderPath = workspaceFolder.uri.fsPath;

	const relativePath = path.relative(workspaceFolderPath, fullFilePath);

	const filePath = path.dirname(relativePath);

	const fileName = path.basename(fullFilePath);
	const fileExtension = fileName.substring(fileName.lastIndexOf('.'));

	const content = await getFileContent(filePath, workspaceFolderPath);

	return {
		fileName: fileName.substring(0, fileName.lastIndexOf('.')),
		fileExtension,
		filePath,
		content,
	};
};
