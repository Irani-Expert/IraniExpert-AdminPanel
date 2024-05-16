import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-schema-generator',
  templateUrl: './schema-generator.component.html',
  styleUrls: ['./schema-generator.component.scss'],
})
export class SchemaGeneratorComponent implements OnInit {
  @Input('schema') schema: string = '';
  @Output('onModified') onModifed = new EventEmitter<string>();
  placeholder = `{
"@context":"http://schema.org",
"@type":"Organization",
"url":"https://www.iraniexpert.com/",
"name":"IRani Expert",
"contactPoint":{
  "@type":"ContactPoint",
  "telephone":"+989150502018",
  "contactType":"تماس با ما"
  }
}`;
  constructor() {}

  ngOnInit(): void {}

  modify() {
    this.onModifed.emit(this.schema);
  }
}
