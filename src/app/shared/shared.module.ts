import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './layout-components/header/header.component';
import { FooterComponent } from './layout-components/footer/footer.component';
import { LoaderComponent } from './layout-components/loader/loader.component';
import { PageHeaderComponent } from './layout-components/page-header/page-header.component';
import { SidebarComponent } from './layout-components/sidebar/sidebar.component';
import { SwitcherComponent } from './layout-components/switcher/switcher.component';
import { TabToTopComponent } from './layout-components/tab-to-top/tab-to-top.component';
import { ContentLayoutComponent } from './layout-components/layout/content-layout/content-layout.component';
import { ErrorLayoutComponent } from './layout-components/layout/error-layout/error-layout.component';
import { FullLayoutComponent } from './layout-components/layout/full-layout/full-layout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { RightSidebarComponent } from './layout-components/right-sidebar/right-sidebar.component';
import { FullscreenDirective } from './directives/fullscreen-toggle.directive';
import { ColorPickerModule } from 'ngx-color-picker';
import { HoverEffectSidebarDirective } from './directives/hover-effect-sidebar.directive';
import { ToggleThemeDirective } from './directives/toggle-theme.directive';
import { SidemenuToggleDirective } from './directives/sidemenuToggle';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SwitcherLayoutComponent } from './layout-components/layout/switcher-layout/switcher-layout.component';
import { HeaderSwitcherComponent } from './header-switcher/header-switcher.component';
import { ToastComponent } from './toast/toast.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TrimWhiteSpaceDirective } from './directives/trim-white-space.directive';

@NgModule({
  declarations: [
    HeaderComponent,
    HeaderSwitcherComponent,
    FooterComponent,
    LoaderComponent,
    PageHeaderComponent,
    SidebarComponent,
    SwitcherComponent,
    SwitcherLayoutComponent,
    TabToTopComponent,
    ContentLayoutComponent,
    ErrorLayoutComponent,
    FullLayoutComponent,
    RightSidebarComponent,
    FullscreenDirective,
    HoverEffectSidebarDirective,
    ToggleThemeDirective,
    SidemenuToggleDirective,
    ToastComponent,
    TrimWhiteSpaceDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule,
    NgScrollbarModule,
    ColorPickerModule,
    CKEditorModule,
  ],
  exports: [
    PageHeaderComponent,
    TabToTopComponent,
    FullLayoutComponent,
    ContentLayoutComponent,
    ErrorLayoutComponent,
    SwitcherComponent,
    SwitcherLayoutComponent,
    LoaderComponent,
    CKEditorModule,
    TrimWhiteSpaceDirective
  ],
})
export class SharedModule { }
