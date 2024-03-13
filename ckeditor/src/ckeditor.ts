/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

// The editor creator to use.
// import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';

// import { Essentials } from '@ckeditor/ckeditor5-essentials';
// import { UploadAdapter } from '@ckeditor/ckeditor5-adapter-ckfinder';
// import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
// import { Bold, Italic, Strikethrough, Subscript,Code } from '@ckeditor/ckeditor5-basic-styles';
// import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
// import { CodeBlock } from '@ckeditor/ckeditor5-code-block';
// import { FontBackgroundColor, FontColor, FontFamily, FontSize  } from '@ckeditor/ckeditor5-font';
// import { CKFinder } from '@ckeditor/ckeditor5-ckfinder';
// import { EasyImage } from '@ckeditor/ckeditor5-easy-image';
// import { Heading } from '@ckeditor/ckeditor5-heading';
// import { Image, ImageCaption, ImageStyle, ImageToolbar, ImageUpload } from '@ckeditor/ckeditor5-image';
// import { Indent } from '@ckeditor/ckeditor5-indent';
// import { Link } from '@ckeditor/ckeditor5-link';
// import { List } from '@ckeditor/ckeditor5-list';
// import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
// import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
// import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office';
// import { Table, TableToolbar } from '@ckeditor/ckeditor5-table';
// import { CloudServices } from '@ckeditor/ckeditor5-cloud-services';


import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import { Bold, Code, Italic, Strikethrough, Subscript, Superscript, Underline } from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { CKBox } from '@ckeditor/ckeditor5-ckbox';
import { CloudServices } from '@ckeditor/ckeditor5-cloud-services';
import { CodeBlock } from '@ckeditor/ckeditor5-code-block';
// import { TableOfContents } from '@ckeditor/ckeditor5-document-outline';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { ExportPdf } from '@ckeditor/ckeditor5-export-pdf';
import { ExportWord } from '@ckeditor/ckeditor5-export-word';
import { FindAndReplace } from '@ckeditor/ckeditor5-find-and-replace';
import { Font } from '@ckeditor/ckeditor5-font';
// import { FormatPainter } from '@ckeditor/ckeditor5-format-painter';
// import { GeneralHtmlSupport } from '@ckeditor/ckeditor5-html-support';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { Highlight } from '@ckeditor/ckeditor5-highlight';
import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line';
import { HtmlEmbed } from '@ckeditor/ckeditor5-html-embed';
import { AutoImage,
    Image,
    ImageCaption,
    ImageInsert,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    PictureEditing
} from '@ckeditor/ckeditor5-image';
// import { ImportWord } from '@ckeditor/ckeditor5-import-word';
import { Indent, IndentBlock } from '@ckeditor/ckeditor5-indent';
import { AutoLink, Link, LinkImage } from '@ckeditor/ckeditor5-link';
// import { DocumentList, DocumentListProperties } from '@ckeditor/ckeditor5-list';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { Mention } from '@ckeditor/ckeditor5-mention';
import { PageBreak } from '@ckeditor/ckeditor5-page-break';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office';
import { RemoveFormat } from '@ckeditor/ckeditor5-remove-format';
import { ShowBlocks } from '@ckeditor/ckeditor5-show-blocks';
// import { SlashCommand } from '@ckeditor/ckeditor5-slash-command';
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing';
import { SpecialCharacters, SpecialCharactersEssentials } from '@ckeditor/ckeditor5-special-characters';
// import { Style } from '@ckeditor/ckeditor5-style';
import { Table, TableCaption, TableCellProperties, TableColumnResize, TableProperties, TableToolbar } from '@ckeditor/ckeditor5-table';
// import { Template } from '@ckeditor/ckeditor5-template';
import { TextTransformation } from '@ckeditor/ckeditor5-typing';
import { WordCount } from '@ckeditor/ckeditor5-word-count';
// import WProofreader from '@webspellchecker/wproofreader-ckeditor5/src/wproofreader';


import MathType from '@wiris/mathtype-ckeditor5';




export default  class AngularEditor extends ClassicEditor {
	// Plugins to include in the build.
	public static override builtinPlugins = [
		MathType,
		// Autoformat,
		// BlockQuote,
		// Bold,
		// Code,
		// Strikethrough, Subscript ,
		// CKFinder,
		// CloudServices,
		// EasyImage,
		// Essentials,
		// Heading,
		// Image,
		// ImageCaption,
		// ImageStyle,
		// ImageToolbar,
		// ImageUpload,
		// Indent,
		// Italic,
		// Link,
		// List,
		// MediaEmbed,
		// Paragraph,
		// PasteFromOffice,
		// Table,
		// TableToolbar,
		// UploadAdapter,
		// FontFamily,
		// FontSize,
		// FontColor,
		// FontBackgroundColor,
		CodeBlock,

		Autoformat, BlockQuote, Bold, Heading, Image, ImageCaption, 
		// FormatPainter,
		ImageStyle, ImageToolbar, Indent, Italic, Link,
		//  DocumentList,
		  MediaEmbed,
		Paragraph, Table, TableToolbar, Alignment, AutoImage, AutoLink,
		CKBox, CloudServices, Code, CodeBlock, Essentials, ExportPdf,
		ExportWord,
		//  ImportWord,
		  FindAndReplace, Font, Highlight, HorizontalLine,
		HtmlEmbed, ImageInsert, ImageResize, ImageUpload, IndentBlock,
		//  GeneralHtmlSupport,
		LinkImage,
		//  DocumentListProperties, 
		// TodoDocumentList, 
		Mention, PageBreak, PasteFromOffice,
		// PasteFromOfficeEnhanced,
		
		PictureEditing, RemoveFormat, ShowBlocks,
		//  SlashCommand,
		  SourceEditing,
		SpecialCharacters, SpecialCharactersEssentials,
		//  Style, 
		 Strikethrough, Subscript, Superscript,
		TableCaption, TableCellProperties, TableColumnResize,
		TableProperties, 
		// TableOfContents,
		//  Template,
		  TextTransformation,
		Underline, WordCount, 
		// WProofreader


		
	];

	// Editor configuration.
	public static override defaultConfig = {
		toolbar: {
			items: [
				// 'undo', 'redo',
				// '|', 'heading',
				// '|', 'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
				// '|', 'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
				// '-', // break point
				// '|', 'alignment',
				// 'link', 'uploadImage', 'blockQuote', 'codeBlock',
				// '|', 'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
				
				'undo', 'redo',
                '|',
                'exportPdf', 'exportWord', 'importWord',
                '|',
                'showBlocks', 'formatPainter', 'findAndReplace', 'selectAll', 'wproofreader',
                '|',
                'heading',
                '|',
                'style',
                '|',
                '|','fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor',
				'MathType', 'ChemType',
				'-', // break point
                '|','bold', 'italic', 'underline',
				'strikethrough', 'subscript', 'superscript', 'code', 'horizontalLine', '|', 'removeFormat',
				'specialCharacters', 'pageBreak',
				'|',
                'link', 'insertImage', 'ckbox', 'insertTable', 'tableOfContents', 'insertTemplate',
				'highlight', 'blockQuote', 'mediaEmbed', 'codeBlock', 'htmlEmbed' ,
                '|',
                'alignment',
                '|',
                'bulletedList',	'numberedList',	'todoList', 'outdent', 'indent',
                '|',
				
                'sourceEditing',
			],
			shouldNotGroupWhenFull: true
		},
		shouldNotGroupWhenFull: false,
		image: {
			toolbar: [
				'imageStyle:block',
				'imageStyle:side',
				'|',
				'imageTextAlternative'
			]
		},
		table: {
			contentToolbar: [
				'tableColumn',
				'tableRow',
				'mergeTableCells'
			]
		},
		licenseKey: 'your-license-key',
		// This value must be kept in sync with the language defined in webpack.config.js.
		language: 'en'
	};
}
