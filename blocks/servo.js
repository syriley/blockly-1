/*
 * Copyright (c) 2016, MakerClub, Simon Riley
 *
 * MAKERCLUB CONFIDENTIAL
 * __________________
 *
 *  [2014] - [2016] MakerClub Ltd
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of MakerClub Ltd and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to MakerClub Ltd
 * and its suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from MakerClub Ltd.
 */

/**
 * @fileoverview C blocks for MakerClub blockly.
 * @author simon@makerclub.org (Simon Riley)
 */
'use strict';

goog.provide('Blockly.Blocks.servo');
goog.provide('Blockly.Constants.Servo');

goog.require('Blockly.Blocks');
goog.require('Blockly');


/**
 * Common HSV hue for all blocks in this category.
 */
Blockly.Blocks.servo.HUE = 260;
Blockly.defineBlocksWithJsonArray([
  {
"type": "servo_to_parameters",
"message0": "Select Parameters",
"colour": 230,
},
{
  "type": "parameters",
  "message0": "Parameters %1 Duration %2  %3 Wait to finish %4 ",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_checkbox",
      "name": "DURATION_PARAMETER",
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_checkbox",
      "name": "WAIT_PARAMETER",
    }
  ],
  "colour": 230,
  "tooltip": "",
  "helpUrl": ""
}]);

var servoToJson = {
  "type": "servo_to",
  "message0": "Servo %1 To %2",
  "args0": [
    {
     "type": "input_dummy",
     "name": "SERVO_PLACEHOLDER"
    },
    {
      "type": "input_value",
      "name": "SERVO_POSITION"
    }
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": 230,
  "tooltip": "",
  "mutator": "servo_parameters_mutator",
  "helpUrl": ""
};

Blockly.Blocks['servo_to'] = {
  init: function(){
    this.jsonInit(servoToJson);

  }
};



Blockly.Blocks['servo_left'] = {
  init: function() {
    this.appendValueInput("SERVO")
        .setCheck("Number")
        .appendField("Servo")
        .appendField(new Blockly.FieldDropdown(Blockly.Python.SERVO_ARRAY), "SERVO_INPUT")
        .appendField("left");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(Blockly.Blocks.servo.HUE);
    this.setTooltip('');
    this.setHelpUrl('http://makerclub.org/');
  }
};

Blockly.Blocks['servo_right'] = {
  init: function() {
    this.appendValueInput("SERVO")
        .setCheck("Number")
        .appendField("Servo")
        .appendField(new Blockly.FieldDropdown(Blockly.Python.SERVO_ARRAY), "SERVO_INPUT")
        .appendField("right");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(Blockly.Blocks.servo.HUE);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.Blocks['servo_get_position'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("servo")
        .appendField(new Blockly.FieldDropdown(Blockly.Python.SERVO_ARRAY), "SERVO_INPUT")
        .appendField("getPosition");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(Blockly.Blocks.servo.HUE);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  },
  getBlockType: function() {
    return Blockly.Types.INTEGER;
  },
};

Blockly.Constants.Servo.PARAMETER_MUTATOR_MIXIN = {

  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('parameters');
    containerBlock.initSvg();
    let durationText = this.durationInput ? 'TRUE' : 'FALSE';
    containerBlock.setFieldValue(durationText,'DURATION_PARAMETER');
    let waitText = this.waitInput ? 'TRUE' : 'FALSE';
    containerBlock.setFieldValue(waitText,'WAIT_PARAMETER');

    return containerBlock;
  },

  compose: function(containerBlock) {
    this.durationInput = (containerBlock.getFieldValue('DURATION_PARAMETER') == 'TRUE');
    this.waitInput = (containerBlock.getFieldValue('WAIT_PARAMETER') == 'TRUE');

    this.updateShape_();
  },
  /**
   * Create XML to represent whether the 'divisorInput' should be present.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');

    if(this.durationInput){
      container.setAttribute('duration', this.durationInput);
    }
    if(this.waitInput){
      container.setAttribute('wait', this.waitInput);
    }
    if(this.selectedServo){
      let newValue = this.getFieldValue('servo_dropdown');
      if(newValue && newValue != this.selectedServo){
        this.selectedServo = newValue;
      }
      container.setAttribute('servo_dropdown', this.selectedServo);
    }
    if(this.selectedServo == 'add servo'){
        debugger;
        this.addVariable();
    }
    else if(this.selectedServo && this.selectedServo.includes('Delete the')){
      this.deleteVariable(this.selectedServo);
    }
    else if (this.selectedServo && this.selectedServo.includes('Delete the')){
      this.renameVariable();
    }
    this.updateDropdown();

    return container;
  },

  setupListener: function(){
    var boundRename = this.onVariableRename.bind(this);
    Blockly.mainWorkspace.addChangeListener(boundRename);
  },
  /**
   * Parse XML to restore the 'divisorInput'.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    // var waitInput = (xmlElement.getAttribute('wait') == true);
    this.durationInput = (xmlElement.getAttribute('duration') == 'true') || false;
    this.waitInput = (xmlElement.getAttribute('wait') == 'true') || false;
    this.selectedServo = xmlElement.getAttribute('servo_dropdown');
    if(this.selectedServo == "undefined"){
      this.selectedServo = undefined;
    }

  },

  onVariableRename: function(event) {
    if(event.type == Blockly.Events.VAR_RENAME ||
      event.type == Blockly.Events.VAR_CREATE ||
      event.type == Blockly.Events.VAR_DELETE
    ){
      if(event.newName && this.selectedServo == event.oldName){
        this.selectedServo = event.newName;
      }
      this.updateShape_();
    }
  },

  addVariable: function(){
      Blockly.Variables.createVariable(Blockly.mainWorkspace, null, 'Servo');
      this.selectedServo = 'new created';
  },

  renameVariable: function(){
    console.log('renaming');
      // Blockly.Variables.createVariable(Blockly.mainWorkspace, null, 'Servo');
      // this.selectedServo = 'new created';
  },

  deleteVariable: function(selectedServo){
    let deleteArray = this.selectedServo.split('\'');
    Blockly.mainWorkspace.deleteVariable(deleteArray[1]);
    console.log('deleting');
  },

  updateDropdown: function(){

    let servoVariables = Blockly.mainWorkspace.getVariablesOfType('Servo');

    if(servoVariables.length){

      this.servoList = [];
      for(var i = 0; i < servoVariables.length; i++){
        let variableName = servoVariables[i].name;
        this.servoList.push([variableName, variableName]);
      }
      let addServo = 'add servo';
      this.servoList.push([addServo, addServo]);
      let deleteServo = `Delete the '${this.selectedServo}' servo`;

      let renameServo = `Rename the '${this.selectedServo}' servo`;
      this.servoList.push([renameServo, renameServo]);

      this.servoList.push([deleteServo, deleteServo]);
    }
    if(!this.servoList){
      return;
    }
    var dropdown = new Blockly.FieldDropdown(this.servoList);
    if(this.selectedServo){
      dropdown.setValue(this.selectedServo);
    }

    let input = this.getInput('SERVO_PLACEHOLDER');
    if(this.getField('servo_dropdown')){
      input.removeField('servo_dropdown');
    }
    if (input){
      input.appendField(dropdown, 'servo_dropdown');
    }
  },

  updateShape_: function() {

    this.updateDropdown();
    let input = this.getInput('SERVO_PLACEHOLDER');
    if(!input){
      return;
    }
    var durationInputExists = this.getInput('DURATION_INPUT');
    if (this.durationInput) {
      if (!durationInputExists) {
        this.appendValueInput('DURATION_INPUT')
        .appendField("Duration")
        .setCheck('Number');
      }
    } else if (durationInputExists) {
      this.removeInput('DURATION_INPUT');
    }

    var waitInputExists = this.getInput('WAIT_INPUT');
    if (this.waitInput) {
      if (!waitInputExists) {
        this.appendValueInput('WAIT_INPUT')
        .appendField("Wait")
        .setCheck('Boolean');
      }
    } else if (waitInputExists) {
      this.removeInput('WAIT_INPUT');
    }
  }
};

Blockly.Constants.Servo.PARAMETER_MUTATOR_EXTENSION = function() {
    this.setupListener();
};

Blockly.Constants.Servo.SETUP_VARIABLES = function() {

};

Blockly.Extensions.registerMutator('servo_parameters_mutator',
  Blockly.Constants.Servo.PARAMETER_MUTATOR_MIXIN,
  Blockly.Constants.Servo.PARAMETER_MUTATOR_EXTENSION,
  ['servo_to_parameters']);
