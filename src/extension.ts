import { Action, Editor, ExtensionBase } from 'parsifly-extension-base';


new class ProjectExport extends ExtensionBase {
  editor = new Editor({
    key: 'ui-editor',
    actions: [
      new Action({
        key: 'add-ui-element',
        action: async () => {
          await this.editor.webView.sendMessage('From extension host');
        }
      }),
    ],
    onDidReceiveMessage: async (value) => {
      console.log('Extension Host:', value);
    },
    resolve: async (id) => {
      await this.editor.webView.sendMessage('From extension host', id);
    },
  });


  async activate() {
    console.log('EXTENSION: Activating');

    this.application.editors.register(this.editor);
  }

  async deactivate() {
    console.log('EXTENSION: Deactivating');

    this.application.editors.unregister(this.editor);
  }
};
