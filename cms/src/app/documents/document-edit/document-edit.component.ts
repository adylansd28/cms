import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {

  originalDocument: Document;
  document: Document;
  editMode: boolean = false;

  id: number;

  constructor( 
    private docService: DocumentService,
    private router: Router,
    private route: ActivatedRoute) { 

  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {

        this.id = +params['id'];

        if (this.id == undefined || this.id == null) {
        this.editMode = false;
        return
        }
        
        this.originalDocument = this.docService.getDocument(this.id);

        if (this.originalDocument == undefined || this.originalDocument == null) {
          return
        }
        
        this.editMode = true;
        this.document = JSON.parse(JSON.stringify(this.originalDocument));

      }
    ) 
  }

  onSubmit (form: NgForm) {

    let value = form.value;
    let newDocument = new Document(this.id.toString(), value.name, value.description, value.url, undefined);

    if (this.editMode == true) {
      this.docService.updateDocument(this.originalDocument, newDocument);
    } else{
      this.docService.addDocument(newDocument);
    }
    
    this.router.navigate(["/documents"]);
  }

  onAddItem(form: NgForm){
    return
  }

  
  onCancel() {
    this.router.navigate(["/documents"]);
  }

}
