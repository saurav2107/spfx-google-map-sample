import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { GoodzerService } from './services/goodzer.service';
import { AppComponent } from './app.component';
import { HttpModule } from "@angular/http";
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule
  ],
  providers: [GoodzerService],
  entryComponents: [AppComponent]
})
export class AppModule {
  constructor() {
  }
  // ngDoBootstrap() { }
  ngDoBootstrap(appRef: ApplicationRef) {
    const rootElements = document.querySelectorAll('app-root');
    for (const element of rootElements as any as HTMLElement[]) {
      appRef.bootstrap(AppComponent, element);
    }
  }
}
