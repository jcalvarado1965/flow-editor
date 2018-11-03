import { Component, OnInit } from '@angular/core';
import * as go from 'gojs/release/go-debug';

let $ = go.GraphObject.make;

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements OnInit {
  myDiagram: any;

  constructor() { }

  ngOnInit() {

    this.myDiagram = $(go.Diagram, "theDiagram",  // create a Diagram for the DIV HTML element
                  {
                    initialContentAlignment: go.Spot.Center,  // center the content
                    "undoManager.isEnabled": true,  // enable undo & redo
                    maxSelectionCount: 1,
                  });

    // define a simple Node template
    this.myDiagram.nodeTemplate =
      $(go.Node, "Horizontal",  
        // the entire node will have a white background
        { background: "white", fromLinkable: true, toLinkable: true },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("fromMaxLinks", "type", t => t === "distribute" || t === "broadcast" ? NaN : 1),
        new go.Binding("toMaxLinks", "type", t =>  t === "join" || t === "race" ? NaN : 1),
        $(go.Picture,
        // making the picture not linkable allows it to be used for dragging
        { margin: 2, width: 16, height: 16, background: "white", fromLinkable: false, toLinkable: false },
        // Picture.source is data bound to the "source" attribute of the model data
        new go.Binding("source", "type", t =>  "assets/icons/" + t + ".svg")),
        $(go.TextBlock,
          { margin: 5 },  // some room around the text
          // TextBlock.text is bound to Node.data.key
          new go.Binding("text", "key"))
      );

      this.myDiagram.linkTemplate =
        $(go.Link,
          { selectable: false },
          $(go.Shape),  // the link shape
          $(go.Shape,   // the arrowhead
            { toArrow: "OpenTriangle", fill: null })
        );
    // but use the default Link template, by not setting Diagram.linkTemplate

    // create the model data that will be represented by Nodes and Links
    this.myDiagram.model = new go.GraphLinksModel(
    [
      { key: "Constant", type: "constant" },
      { key: "Get data", type: "web-method" },
      { key: "Distribute array", type: "distribute" },
      { key: "Process data", type: "web-method" },
      { key: "Combine results", type: "join" }
    ],
    [
      { from: "Constant", to: "Get data" },
      { from: "Get data", to: "Distribute array" },
      { from: "Distribute array", to: "Process data" },
      { from: "Process data", to: "Combine results" }
    ]);
  }

  addStep(type: string) {
    this.myDiagram.startTransaction("add node");
    let data = <any>{key: type, type: type};
    data.loc = go.Point.stringify(new go.Point(-20,-20));

    this.myDiagram.model.addNodeData(data)
    this.myDiagram.commitTransaction("add node");
  }
}
