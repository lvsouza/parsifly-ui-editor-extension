import { Action, Editor, ExtensionBase } from '@parsifly/extension-basics';


new class ProjectExport extends ExtensionBase {
  editor = new Editor({
    key: 'ui-editor',
    actions: [
      new Action({
        key: 'add-ui-element',
        action: async () => {
          console.log('UI Editor action');
        }
      }),
    ],
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
