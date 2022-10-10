import { Component, OnInit } from '@angular/core';
import { Document } from './document.model';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  currentDocument: Document;

  constructor() { }

  ngOnInit(): void {
  }

  getCurrentDocument(newDoc: Document){
    this.currentDocument = newDoc;
  }
}
