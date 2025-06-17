import { ExtensionBase } from '@parsifly/extension-basics';


new class ProjectExport extends ExtensionBase {

  async activate() {
    console.log('EXTENSION: Activating');
  }

  async deactivate() {
    console.log('EXTENSION: Deactivating');
  }
};
