import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { from } from 'rxjs';
import { HomeComponent } from './home/home.component';
import { ApiService } from './api.service';
import { HelperService } from './helper.service';
import { ChatComponent } from './chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'chat', component: ChatComponent, pathMatch: 'full' }
    ]),
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatSidenavModule,
    HttpClientModule
  ],
  providers: [ApiService, HelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
