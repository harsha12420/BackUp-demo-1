import { Component } from '@angular/core';
import AngularEditor from '../../../../../../ckeditor/build/ckeditor';

@Component({
  selector: 'app-test-editor',
  templateUrl: './test-editor.component.html',
  styleUrls: ['./test-editor.component.scss'],
})
export class TestEditorComponent {
  editorData = 'DemoCK';
  public Editor: any = AngularEditor;
}
