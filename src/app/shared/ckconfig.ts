// export const ckeConfig = {
//   filebrowserBrowseUrl: 'dl.iraniexpert.com//uploads/images/articles',
//   filebrowserUploadUrl:
//     'https://dl.iraniexpert.com/FileUploader/FileUploadCkEditor',
//   allowedContent: false,
//   forcePasteAsPlainText: true,
//   skin: 'moono-lisa',
//   defaultLanguage: 'en',
//   language: 'en',
//   readOnly: false,
//   removeButtons:
//     'Underline,Subscript,Superscript,Save,NewPage,Preview,Print,' +
//     'Scayt,' +
//     'Radio,Select,Button,HiddenField,Strike,RemoveFormat,' +
//     'Outdent,Indent,Blockquote,Anchor,' +
//     'Flash,HorizontalRule,PageBreak,InsertPre,' +
//     'ShowBlocks,MediaEmbed,About,Language',
//   removePlugins: 'elementspath,save,magicline,blockquote',
//   extraPlugins:
//     'smiley,justify,colordialog,divarea,indentblock,forms,pastefromword',
// };

import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { styles } from './cke-styles';
import { headings } from './ck-headings';
import { UploadAdapter } from './upload-adapter';
import { HttpClient, HttpHandler } from '@angular/common/http';

export interface StyleDefinition {
  name: string;
  element: string;
  classes: string[];
}

export class Ckeditor {
  Editor = Editor.Editor;
  constructor(uploadUrl?: string) {
    // this.setUploadUrl(uploadUrl);
    this.Editor.defaultConfig.style = {
      definitions: styles,
    };

    this.Editor.defaultConfig.htmlSupport = {
      allow: [
        {
          name: /.*/,
          attributes: true,
          classes: true,
          styles: true,
        },
      ],
    };
    this.Editor.defaultConfig.fontSize = {
      options: [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 26, 28, 36, 48, 72],
      supportAllValues: true,
    };
    this.Editor.defaultConfig.language = 'fa';
    this.Editor.defaultConfig.toolbar = {
      ...this.Editor.defaultConfig.toolbar,
      ...{
        removeItems: ['textPartLanguage', 'imageUpload', 'numberedList'],
        shouldNotGroupWhenFull: true,
      },
    };
    this.Editor.defaultConfig.heading = {
      options: headings,
    };
  }

  // setUploadUrl(uploadUrl: string) {
  //   this.Editor.defaultConfig.simpleUpload = {
  //     uploadUrl: uploadUrl
  //       ? uploadUrl
  //       : 'https://dl.iraniexpert.com/Files/UploadCKEditor',
  //   };
  //   // There is Other Configuration as In need
  //   // Headers sent along with the XMLHttpRequest to the upload server.
  //   //  headers: {
  //   //      'X-CSRF-TOKEN': 'CSRF-Token',
  //   //

  //   // Enable the XMLHttpRequest.withCredentials property.
  //   //  withCredentials: true,
  // }

  setStyle(styles: StyleDefinition[]) {
    if (styles.length > 0) {
    } else {
      return;
    }
  }
}
