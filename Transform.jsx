function main(thisObj) {
  // WIN
  // ===
  var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", scriptname, undefined, { resizeable: true });
  win.alignChildren = ["center", "top"];
  win.spacing = 10;
  win.margins = 10;

  // GROUP1
  // ======
  var group1 = win.add("group", undefined, { name: "group1" });
  group1.orientation = "row";
  group1.alignChildren = ["left", "center"];
  group1.spacing = 10;
  group1.margins = 0;

  var positionBtn = group1.add("radiobutton", undefined, undefined, { name: "radiosequence" });
  positionBtn.text = "Position";
  positionBtn.value = true;

  var rotateBtn = group1.add("radiobutton", undefined, undefined, { name: "radiorandomize" });
  rotateBtn.text = "Rotate";

  var scaleBtn = group1.add("radiobutton", undefined, undefined, { name: "radiobutton3" });
  scaleBtn.text = "Scale";

  // GROUP2
  // ======
  var group2 = win.add("group", undefined, { name: "group2" });
  group2.orientation = "row";
  group2.alignChildren = ["left", "center"];
  group2.spacing = 10;
  group2.margins = 0;

  var xbox = group2.add("checkbox", undefined, undefined, { name: "checkbox1" });
  xbox.text = "X";

  var ybox = group2.add("checkbox", undefined, undefined, { name: "checkbox2" });
  ybox.text = "Y";

  var zbox = group2.add("checkbox", undefined, undefined, { name: "checkbox3" });
  zbox.text = "Z";

  // GROUP3
  // ======
  var group3 = win.add("group", undefined, { name: "group3" });
  group3.orientation = "row";
  group3.alignChildren = ["left", "center"];
  group3.spacing = 10;
  group3.margins = 0;

  var statictext = group3.add("statictext", undefined, undefined, { name: "statictext1" });
  statictext.text = "Amount";

  var amount = group3.add('edittext {properties: {name: "amount"}}');
  amount.preferredSize.width = 69;

  // GROUP4
  // ======
  var group4 = win.add("group", undefined, { name: "group4" });
  group4.orientation = "row";
  group4.alignChildren = ["left", "center"];
  group4.spacing = 10;
  group4.margins = 0;

  var sequence = group4.add("button", undefined, undefined, { name: "sequence" });
  sequence.text = "Sequence";

  var randomize = group4.add("button", undefined, undefined, { name: "randomize" });
  randomize.text = "Randomize";

  win.onResize = function () {
    win.layout.resize();
  }

  win.layout.layout();

  sequence.onClick = function () {
    app.beginUndoGroup("sequence");
    try {
      if (amount.text == '') return
      if (!xbox.value && !ybox.value && !zbox.value) return
      var comp = app.project.activeItem;
      var selectedLayers = comp.selectedLayers;
      var X = 0
      var Y = 0
      var Z = 0
      if (xbox.value) X = 1
      if (ybox.value) Y = 1
      if (zbox.value) Z = 1
      if (positionBtn.value) {
        // position
        for (var i = 0; i < selectedLayers.length; i++) {
          var selectedLater = selectedLayers[i]
          var position = selectedLater.property('ADBE Transform Group').property('ADBE Position')
          var numKey = position.numKeys
          if (zbox.value && !selectedLater.threeDLayer) selectedLater.threeDLayer = true
          if (!position.dimensionsSeparated) {
            // 次元分割されていない場合
            if (numKey == 0) {
              var value = position.value
              position.setValue([value[0] + parseInt(amount.text) * X * i,
              value[1] + parseInt(amount.text) * Y * i, value[2] + parseInt(amount.text) * Z * i])
            } else {
              var value = position.valueAtTime(comp.time, true)
              position.setValueAtTime(comp.time, [value[0] + parseInt(amount.text) * X * i,
              value[1] + parseInt(amount.text) * Y * i, value[2] + parseInt(amount.text) * Z * i])
            }
          } else {
            // 次元分割されている場合
            if (numKey == 0) {
              var value = []
              value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_0").value)
              value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_1").value)
              value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_2").value)
              selectedLater.property("ADBE Transform Group").property("ADBE Position_0").setValue(value[0] + parseInt(amount.text) * X * i)
              selectedLater.property("ADBE Transform Group").property("ADBE Position_1").setValue(value[1] + parseInt(amount.text) * Y * i)
              if (selectedLater.threeDLayer) {
                selectedLater.property("ADBE Transform Group").property("ADBE Position_2").setValue(value[2] + parseInt(amount.text) * Z * i)
              }
            } else {
              var value = []
              value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_0").valueAtTime(comp.time, true))
              value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_1").valueAtTime(comp.time, true))
              value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_2").valueAtTime(comp.time, true))
              selectedLater.property("ADBE Transform Group").property("ADBE Position_0").setValueAtTime(comp.time, value[0] + parseInt(amount.text) * X * i)
              selectedLater.property("ADBE Transform Group").property("ADBE Position_1").setValueAtTime(comp.time, value[1] + parseInt(amount.text) * Y * i)
              if (selectedLater.threeDLayer) {
                selectedLater.property("ADBE Transform Group").property("ADBE Position_2").setValueAtTime(comp.time, value[2] + parseInt(amount.text) * Z * i)
              }
            }
          }
        }
      } else if (rotateBtn.value) {
        // rotate
        for (var i = 0; i < selectedLayers.length; i++) {
          var selectedLater = selectedLayers[i]
          var rotateX = selectedLater.property('ADBE Transform Group').property('ADBE Rotate X')
          var rotateY = selectedLater.property('ADBE Transform Group').property('ADBE Rotate Y')
          var rotateZ = selectedLater.property('ADBE Transform Group').property('ADBE Rotate Z')
          var numKeyX = rotateX.numKeys
          var numKeyY = rotateY.numKeys
          var numKeyZ = rotateZ.numKeys
          if ((xbox.value && !selectedLater.threeDLayer) || (ybox.value && !selectedLater.threeDLayer)) selectedLater.threeDLayer = true
          // X
          if (xbox.value) {
            if (numKeyX == 0) {
              var value = rotateX.value
              rotateX.setValue(value + parseInt(amount.text) * i)
            } else {
              var value = rotateX.valueAtTime(comp.time, true)
              rotateX.setValueAtTime(comp.time, value + parseInt(amount.text) * i)
            }
          }
          // Y
          if (ybox.value) {
            if (numKeyY == 0) {
              var value = rotateY.value
              rotateY.setValue(value + parseInt(amount.text) * i)
            } else {
              var value = rotateY.valueAtTime(comp.time, true)
              rotateY.setValueAtTime(comp.time, value + parseInt(amount.text) * i)
            }
          }
          // Z
          if (zbox.value) {
            if (numKeyZ == 0) {
              var value = rotateZ.value
              rotateZ.setValue(value + parseInt(amount.text)* i)
            } else {
              var value = rotateZ.valueAtTime(comp.time, true)
              rotateZ.setValueAtTime(comp.time, value + parseInt(amount.text) * i)
            }
          }
        }
      } else {
        // scale
        for (var i = 0; i < selectedLayers.length; i++) {
          var selectedLater = selectedLayers[i]
          var scale = selectedLater.property('ADBE Transform Group').property('ADBE Scale')
          var numKey = scale.numKeys
          if (numKey == 0) {
            var value = scale.value
            scale.setValue([value[0] + parseInt(amount.text) * X * i,
            value[1] + parseInt(amount.text) * Y * i, value[2] + parseInt(amount.text) * Z * i])
          } else {
            var value = scale.valueAtTime(comp.time, true)
            scale.setValueAtTime(comp.time, [value[0] + parseInt(amount.text) * X * i,
            value[1] + parseInt(amount.text) * Y * i, value[2] + parseInt(amount.text) * Z * i])
          }
        }
      }
    } catch (e) {
      alert(e.message + e.line)
    }
    app.endUndoGroup();
  }
  
  randomize.onClick = function () {
    app.beginUndoGroup("sequence");
    try {
      if (amount.text == '') return
      if (!xbox.value && !ybox.value && !zbox.value) return
      var comp = app.project.activeItem;
      var selectedLayers = comp.selectedLayers;
      var X = 0
      var Y = 0
      var Z = 0
      if (xbox.value) X = 1
      if (ybox.value) Y = 1
      if (zbox.value) Z = 1
      if (positionBtn.value) {
        // position
        for (var i = 0; i < selectedLayers.length; i++) {
          var selectedLater = selectedLayers[i]
          var position = selectedLater.property('ADBE Transform Group').property('ADBE Position')
          var numKey = position.numKeys
          if (zbox.value && !selectedLater.threeDLayer) selectedLater.threeDLayer = true
          if (!position.dimensionsSeparated) {
            // 次元分割されていない場合
            if (numKey == 0) {
              var value = position.value
              position.setValue([value[0] + parseInt(amount.text) * X * (generateRandomNumber() * 2 - 1),
              value[1] + parseInt(amount.text) * Y * (generateRandomNumber() * 2 - 1), value[2] + parseInt(amount.text) * Z * (generateRandomNumber() * 2 - 1)])
            } else {
              var value = position.valueAtTime(comp.time, true)
              position.setValueAtTime(comp.time, [value[0] + parseInt(amount.text) * X * (generateRandomNumber() * 2 - 1),
              value[1] + parseInt(amount.text) * Y * (generateRandomNumber() * 2 - 1), value[2] + parseInt(amount.text) * Z * (generateRandomNumber() * 2 - 1)])
            }
          } else {
            // 次元分割されている場合
            if (numKey == 0) {
              var value = []
              value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_0").value)
              value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_1").value)
              value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_2").value)
              selectedLater.property("ADBE Transform Group").property("ADBE Position_0").setValue(value[0] + parseInt(amount.text) * X * (generateRandomNumber() * 2 - 1))
              selectedLater.property("ADBE Transform Group").property("ADBE Position_1").setValue(value[1] + parseInt(amount.text) * Y * (generateRandomNumber() * 2 - 1))
              if (selectedLater.threeDLayer) {
                selectedLater.property("ADBE Transform Group").property("ADBE Position_2").setValue(value[2] + parseInt(amount.text) * Z * (generateRandomNumber() * 2 - 1))
              }
            } else {
              var value = []
              value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_0").valueAtTime(comp.time, true))
              value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_1").valueAtTime(comp.time, true))
              value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_2").valueAtTime(comp.time, true))
              selectedLater.property("ADBE Transform Group").property("ADBE Position_0").setValueAtTime(comp.time, value[0] + parseInt(amount.text) * X * (generateRandomNumber() * 2 - 1))
              selectedLater.property("ADBE Transform Group").property("ADBE Position_1").setValueAtTime(comp.time, value[1] + parseInt(amount.text) * Y * (generateRandomNumber() * 2 - 1))
              if (selectedLater.threeDLayer) {
                selectedLater.property("ADBE Transform Group").property("ADBE Position_2").setValueAtTime(comp.time, value[2] + parseInt(amount.text) * Z * (generateRandomNumber() * 2 - 1))
              }
            }
          }
        }
      } else if (rotateBtn.value) {
        // rotate
        for (var i = 0; i < selectedLayers.length; i++) {
          var selectedLater = selectedLayers[i]
          var rotateX = selectedLater.property('ADBE Transform Group').property('ADBE Rotate X')
          var rotateY = selectedLater.property('ADBE Transform Group').property('ADBE Rotate Y')
          var rotateZ = selectedLater.property('ADBE Transform Group').property('ADBE Rotate Z')
          var numKeyX = rotateX.numKeys
          var numKeyY = rotateY.numKeys
          var numKeyZ = rotateZ.numKeys
          if ((xbox.value && !selectedLater.threeDLayer) || (ybox.value && !selectedLater.threeDLayer)) selectedLater.threeDLayer = true
          // X
          if (xbox.value) {
            if (numKeyX == 0) {
              var value = rotateX.value
              rotateX.setValue(value + parseInt(amount.text) * (generateRandomNumber() * 2 - 1))
            } else {
              var value = rotateX.valueAtTime(comp.time, true)
              rotateX.setValueAtTime(comp.time, value + parseInt(amount.text) * (generateRandomNumber() * 2 - 1))
            }
          }
          // Y
          if (ybox.value) {
            if (numKeyY == 0) {
              var value = rotateY.value
              rotateY.setValue(value + parseInt(amount.text) * (generateRandomNumber() * 2 - 1))
            } else {
              var value = rotateY.valueAtTime(comp.time, true)
              rotateY.setValueAtTime(comp.time, value + parseInt(amount.text) * (generateRandomNumber() * 2 - 1))
            }
          }
          // Z
          if (zbox.value) {
            if (numKeyZ == 0) {
              var value = rotateZ.value
              rotateZ.setValue(value + parseInt(amount.text)* (generateRandomNumber() * 2 - 1))
            } else {
              var value = rotateZ.valueAtTime(comp.time, true)
              rotateZ.setValueAtTime(comp.time, value + parseInt(amount.text) * (generateRandomNumber() * 2 - 1))
            }
          }
        }
      } else {
        // scale
        for (var i = 0; i < selectedLayers.length; i++) {
          var selectedLater = selectedLayers[i]
          var scale = selectedLater.property('ADBE Transform Group').property('ADBE Scale')
          var numKey = scale.numKeys
          if (numKey == 0) {
            var value = scale.value
            scale.setValue([value[0] + parseInt(amount.text) * X * (generateRandomNumber() * 2 - 1),
            value[1] + parseInt(amount.text) * Y * (generateRandomNumber() * 2 - 1), value[2] + parseInt(amount.text) * Z * (generateRandomNumber() * 2 - 1)])
          } else {
            var value = scale.valueAtTime(comp.time, true)
            scale.setValueAtTime(comp.time, [value[0] + parseInt(amount.text) * X * i,
            value[1] + parseInt(amount.text) * Y * (generateRandomNumber() * 2 - 1), value[2] + parseInt(amount.text) * Z * (generateRandomNumber() * 2 - 1)])
          }
        }
      }
    } catch (e) {
      alert(e.message + e.line)
    }
    app.endUndoGroup();
  }
}

main(this)