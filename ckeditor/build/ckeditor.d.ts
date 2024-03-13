/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";
export default class AngularEditor extends ClassicEditor {
    static builtinPlugins: any[];
    static defaultConfig: {
        toolbar: {
            items: string[];
            shouldNotGroupWhenFull: boolean;
        };
        shouldNotGroupWhenFull: boolean;
        image: {
            toolbar: string[];
        };
        table: {
            contentToolbar: string[];
        };
        licenseKey: string;
        language: string;
    };
}
