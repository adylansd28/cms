import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Contact } from '../contact.model';

@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.component.html',
  styleUrls: ['./contact-item.component.css']
})
export class ContactItemComponent implements OnInit {

  @Input() newContact: Contact;
  @Output() contactSelected = new EventEmitter<Contact>();

  constructor() { }

  ngOnInit(): void {
  }

  onSelected(){
    this.contactSelected.emit();
  }

}
