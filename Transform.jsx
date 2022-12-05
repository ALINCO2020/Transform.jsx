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
  var group2top = win.add('group')
  group2top.orientation = 'stack'

  var group2 = group2top.add("group", undefined, { name: "group2" });
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


  var group2Mirror = group2top.add("group", undefined, { name: "group2" });
  group2Mirror.orientation = "row";
  group2Mirror.alignChildren = ["left", "center"];
  group2Mirror.spacing = 10;
  group2Mirror.margins = 0;
  group2Mirror.visible = false

  var xboxScale = group2Mirror.add("checkbox", undefined, undefined, { name: "checkbox1" });
  xboxScale.text = "X";
  xboxScale.enabled = false

  var yboxScale = group2Mirror.add("checkbox", undefined, undefined, { name: "checkbox2" });
  yboxScale.text = "Y";
  yboxScale.enabled = false

  var zboxScale = group2Mirror.add("checkbox", undefined, undefined, { name: "checkbox3" });
  zboxScale.text = "Z";
  zboxScale.enabled = false

  var fixed = group2Mirror.add('checkbox', undefined, 'Fixed')
  fixed.value = true

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

  positionBtn.onClick = function () {
    group2.visible = true
    group2Mirror.visible = false
  }

  rotateBtn.onClick = function () {
    group2.visible = true
    group2Mirror.visible = false
  }

  scaleBtn.onClick = function () {
    group2Mirror.visible = true
    group2.visible = false
  }

  win.onResize = function () {
    win.layout.resize();
  }

  win.layout.layout();

  fixed.onClick = function () {
    if (!fixed.value) {
      xboxScale.enabled = true
      yboxScale.enabled = true
      zboxScale.enabled = true
    } else {
      xboxScale.enabled = false
      yboxScale.enabled = false
      zboxScale.enabled = false
    }
  }

  sequence.onClick = function () {
    app.beginUndoGroup("sequence");
    try {
      if (amount.text == '') return
      // XYZどれにもチェックが入ってなかったらリターン
      if (!scaleBtn.value) {
        if (!xbox.value && !ybox.value && !zbox.value) return
      } else {
        // scaleの場合
        if (!fixed.value) {
          if (!xboxScale.value && !yboxScale.value && !zboxScale.value) return
        }
      }
      var keyState = ScriptUI.environment.keyboardState;
      if (keyState.altKey) {
        var alt = -1
      } else {
        var alt = 1
      }
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
          if (numKey != 0) var nearestKeyTime = position.keyTime(position.nearestKeyIndex(comp.time))
          if (zbox.value && !selectedLater.threeDLayer) selectedLater.threeDLayer = true
          if (!position.dimensionsSeparated) {
            // 次元分割されていない場合
            if (numKey == 0) {
              var value = position.value
              position.setValue([value[0] + parseInt(amount.text) * X * i * alt,
              value[1] + parseInt(amount.text) * Y * i * alt, value[2] + parseInt(amount.text) * Z * i * alt])
            // ctrlクリックならすべてのキーフレームを更新しない
            } else if (nearestKeyTime - comp.time != 0 || keyState.ctrlKey) {
              var value = position.valueAtTime(comp.time, true)
              position.setValueAtTime(comp.time, [value[0] + parseInt(amount.text) * X * i * alt,
              value[1] + parseInt(amount.text) * Y * i * alt, value[2] + parseInt(amount.text) * Z * i * alt])
            } else {
              for (var j = 1; j <= numKey; j++) {
                var value = position.valueAtTime(position.keyTime(j), true)
                position.setValueAtTime(position.keyTime(j), [value[0] + parseInt(amount.text) * X * i * alt,
                value[1] + parseInt(amount.text) * Y * i * alt, value[2] + parseInt(amount.text) * Z * i * alt])
              }
            }
          } else {
            // 次元分割されている場合
            if (numKey == 0) {
              var value = []
              value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_0").value)
              value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_1").value)
              value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_2").value)
              selectedLater.property("ADBE Transform Group").property("ADBE Position_0").setValue(value[0] + parseInt(amount.text) * X * i * alt)
              selectedLater.property("ADBE Transform Group").property("ADBE Position_1").setValue(value[1] + parseInt(amount.text) * Y * i * alt)
              if (selectedLater.threeDLayer) {
                selectedLater.property("ADBE Transform Group").property("ADBE Position_2").setValue(value[2] + parseInt(amount.text) * Z * i * alt)
              }
            } else if (nearestKeyTime - comp.time != 0 || keyState.ctrlKey) {
              var value = []
              value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_0").valueAtTime(comp.time, true))
              value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_1").valueAtTime(comp.time, true))
              value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_2").valueAtTime(comp.time, true))
              selectedLater.property("ADBE Transform Group").property("ADBE Position_0").setValueAtTime(comp.time, value[0] + parseInt(amount.text) * X * i * alt)
              selectedLater.property("ADBE Transform Group").property("ADBE Position_1").setValueAtTime(comp.time, value[1] + parseInt(amount.text) * Y * i * alt)
              if (selectedLater.threeDLayer) {
                selectedLater.property("ADBE Transform Group").property("ADBE Position_2").setValueAtTime(comp.time, value[2] + parseInt(amount.text) * Z * i * alt)
              }
            } else {
              for (var j = 1; j <= numKey; j++) {
                var value = []
                value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_0").valueAtTime(position.keyTime(j), true))
                value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_1").valueAtTime(position.keyTime(j), true))
                value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_2").valueAtTime(position.keyTime(j), true))
                selectedLater.property("ADBE Transform Group").property("ADBE Position_0").setValueAtTime(position.keyTime(j), value[0] + parseInt(amount.text) * X * i * alt)
                selectedLater.property("ADBE Transform Group").property("ADBE Position_1").setValueAtTime(position.keyTime(j), value[1] + parseInt(amount.text) * Y * i * alt)
                if (selectedLater.threeDLayer) {
                  selectedLater.property("ADBE Transform Group").property("ADBE Position_2").setValueAtTime(position.keyTime(j), value[2] + parseInt(amount.text) * Z * i * alt)
                }
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
          if (numKeyX != 0) var nearestKeyTimeX = rotateX.keyTime(rotateX.nearestKeyIndex(comp.time))
          if (numKeyY != 0) var nearestKeyTimeY = rotateY.keyTime(rotateY.nearestKeyIndex(comp.time))
          if (numKeyZ != 0) var nearestKeyTimeZ = rotateZ.keyTime(rotateZ.nearestKeyIndex(comp.time))
          if ((xbox.value && !selectedLater.threeDLayer) || (ybox.value && !selectedLater.threeDLayer)) selectedLater.threeDLayer = true
          // X
          if (xbox.value) {
            if (numKeyX == 0) {
              var value = rotateX.value
              rotateX.setValue(value + parseInt(amount.text) * i * alt)
            } else if (nearestKeyTimeX - comp.time != 0 || keyState.ctrlKey) {
              var value = rotateX.valueAtTime(comp.time, true)
              rotateX.setValueAtTime(comp.time, value + parseInt(amount.text) * i * alt)
            } else {
              for (var j = 1; j <= numKeyX; j++) {
                var value = rotateX.valueAtTime(rotateX.keyTime(j), true)
                rotateX.setValueAtTime(rotateX.keyTime(j), value + parseInt(amount.text) * i * alt)
              }
            }
          }
          // Y
          if (ybox.value) {
            if (numKeyY == 0) {
              var value = rotateY.value
              rotateY.setValue(value + parseInt(amount.text) * i * alt)
            } else if (nearestKeyTimeY - comp.time != 0 || keyState.ctrlKey) {
              var value = rotateY.valueAtTime(comp.time, true)
              rotateY.setValueAtTime(comp.time, value + parseInt(amount.text) * i * alt)
            } else {
              for (var j = 1; j <= numKeyY; j++) {
                var value = rotateY.valueAtTime(rotateY.keyTime(j), true)
                rotateY.setValueAtTime(rotateY.keyTime(j), value + parseInt(amount.text) * i * alt)
              }
            }
          }
          // Z
          if (zbox.value) {
            if (numKeyZ == 0) {
              var value = rotateZ.value
              rotateZ.setValue(value + parseInt(amount.text) * i * alt)
            } else if (nearestKeyTimeZ - comp.time != 0 || keyState.ctrlKey) {
              var value = rotateZ.valueAtTime(comp.time, true)
              rotateZ.setValueAtTime(comp.time, value + parseInt(amount.text) * i * alt)
            } else {
              for (var j = 1; j <= numKeyZ; j++) {
                var value = rotateZ.valueAtTime(rotateZ.keyTime(j), true)
                rotateZ.setValueAtTime(rotateZ.keyTime(j), value + parseInt(amount.text) * i * alt)
              }
            }
          }
        }
      } else {
        // scale
        var X = 0
        var Y = 0
        var Z = 0
        if (xboxScale.value) X = 1
        if (yboxScale.value) Y = 1
        if (zboxScale.value) Z = 1
        if (fixed.value == false) {
          // 固定じゃない場合
          for (var i = 0; i < selectedLayers.length; i++) {
            var selectedLater = selectedLayers[i]
            var scale = selectedLater.property('ADBE Transform Group').property('ADBE Scale')
            var numKey = scale.numKeys
            if (numKey != 0) var nearestKeyTime = scale.keyTime(scale.nearestKeyIndex(comp.time))
            if (numKey == 0) {
              var value = scale.value
              scale.setValue([value[0] + parseInt(amount.text) * X * i * alt,
              value[1] + parseInt(amount.text) * Y * i * alt, value[2] + parseInt(amount.text) * Z * i * alt])
            } else if (nearestKeyTime - comp.time != 0 || keyState.ctrlKey) {
              var value = scale.valueAtTime(comp.time, true)
              scale.setValueAtTime(comp.time, [value[0] + parseInt(amount.text) * X * i * alt,
              value[1] + parseInt(amount.text) * Y * i * alt, value[2] + parseInt(amount.text) * Z * i * alt])
            } else {
              for (var j = 1; j <= numKey; j++) {
                var value = scale.valueAtTime(scale.keyTime(j), true)
                scale.setValueAtTime(scale.keyTime(j), [value[0] + parseInt(amount.text) * X * i * alt,
                value[1] + parseInt(amount.text) * Y * i * alt, value[2] + parseInt(amount.text) * Z * i * alt])
              }
            }
          }
        } else {
          // Fixed(固定)の場合
          for (var i = 0; i < selectedLayers.length; i++) {
            var selectedLater = selectedLayers[i]
            var scale = selectedLater.property('ADBE Transform Group').property('ADBE Scale')
            var numKey = scale.numKeys
            if (numKey != 0) var nearestKeyTime = scale.keyTime(scale.nearestKeyIndex(comp.time))
            if (numKey == 0) {
              var value = scale.value
              scale.setValue([value[0] + parseInt(amount.text) * i * alt,
              value[1] + parseInt(amount.text) * i * alt, value[2] + parseInt(amount.text) * i * alt])
            } else if (nearestKeyTime - comp.time != 0 || keyState.ctrlKey) {
              var value = scale.valueAtTime(comp.time, true)
              scale.setValueAtTime(comp.time, [value[0] + parseInt(amount.text) * i * alt,
              value[1] + parseInt(amount.text) * i * alt, value[2] + parseInt(amount.text) * i * alt])
            } else {
              for (var j = 1; j <= numKey; j++) {
                var value = scale.valueAtTime(scale.keyTime(j), true)
                scale.setValueAtTime(scale.keyTime(j), [value[0] + parseInt(amount.text) * i * alt,
                value[1] + parseInt(amount.text) * i * alt, value[2] + parseInt(amount.text) * i * alt])
              }
            }
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
      // XYZどれにもチェックが入ってなかったらリターン
      if (!scaleBtn.value) {
        if (!xbox.value && !ybox.value && !zbox.value) return
      } else {
        // scaleの場合
        if (!fixed.value) {
          if (!xboxScale.value && !yboxScale.value && !zboxScale.value) return
        }
      }
      var keyState = ScriptUI.environment.keyboardState;
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
          if (numKey != 0) var nearestKeyTime = position.keyTime(position.nearestKeyIndex(comp.time))
          if (zbox.value && !selectedLater.threeDLayer) selectedLater.threeDLayer = true
          var randX = generateRandomNumber() * 2 - 1
          var randY = generateRandomNumber() * 2 - 1
          var randZ = generateRandomNumber() * 2 - 1
          if (!position.dimensionsSeparated) {
            // 次元分割されていない場合
            if (numKey == 0) {
              var value = position.value
              position.setValue([value[0] + parseInt(amount.text) * X * randX,
              value[1] + parseInt(amount.text) * Y * randY, value[2] + parseInt(amount.text) * Z * randZ])
            } else if (nearestKeyTime - comp.time != 0 || keyState.ctrlKey) {
              var value = position.valueAtTime(comp.time, true)
              position.setValueAtTime(comp.time, [value[0] + parseInt(amount.text) * X * randX,
              value[1] + parseInt(amount.text) * Y * randY, value[2] + parseInt(amount.text) * Z * randZ])
            } else {
              for (var j = 1; j <= numKey; j++) {
                var value = position.valueAtTime(position.keyTime(j), true)
                position.setValueAtTime(position.keyTime(j), [value[0] + parseInt(amount.text) * X * randX,
                value[1] + parseInt(amount.text) * Y * randY, value[2] + parseInt(amount.text) * Z * randZ])
              }
            }
          } else {
            // 次元分割されている場合
            if (numKey == 0) {
              var value = []
              value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_0").value)
              value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_1").value)
              value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_2").value)
              selectedLater.property("ADBE Transform Group").property("ADBE Position_0").setValue(value[0] + parseInt(amount.text) * X * randX)
              selectedLater.property("ADBE Transform Group").property("ADBE Position_1").setValue(value[1] + parseInt(amount.text) * Y * randY)
              if (selectedLater.threeDLayer) {
                selectedLater.property("ADBE Transform Group").property("ADBE Position_2").setValue(value[2] + parseInt(amount.text) * Z * randZ)
              }
            } else if (nearestKeyTime - comp.time != 0 || keyState.ctrlKey) {
              var value = []
              value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_0").valueAtTime(comp.time, true))
              value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_1").valueAtTime(comp.time, true))
              value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_2").valueAtTime(comp.time, true))
              selectedLater.property("ADBE Transform Group").property("ADBE Position_0").setValueAtTime(comp.time, value[0] + parseInt(amount.text) * X * randX)
              selectedLater.property("ADBE Transform Group").property("ADBE Position_1").setValueAtTime(comp.time, value[1] + parseInt(amount.text) * Y * randY)
              if (selectedLater.threeDLayer) {
                selectedLater.property("ADBE Transform Group").property("ADBE Position_2").setValueAtTime(comp.time, value[2] + parseInt(amount.text) * Z * randZ)
              }
            } else {
              for (var j = 1; j <= numKey; j++) {
                var value = []
                value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_0").valueAtTime(position.keyTime(j), true))
                value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_1").valueAtTime(position.keyTime(j), true))
                value.push(selectedLater.property("ADBE Transform Group").property("ADBE Position_2").valueAtTime(position.keyTime(j), true))
                selectedLater.property("ADBE Transform Group").property("ADBE Position_0").setValueAtTime(position.keyTime(j), value[0] + parseInt(amount.text) * X * randX)
                selectedLater.property("ADBE Transform Group").property("ADBE Position_1").setValueAtTime(position.keyTime(j), value[1] + parseInt(amount.text) * Y * randY)
                if (selectedLater.threeDLayer) {
                  selectedLater.property("ADBE Transform Group").property("ADBE Position_2").setValueAtTime(position.keyTime(j), value[2] + parseInt(amount.text) * Z * randZ)
                }
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
          if (numKeyX != 0) var nearestKeyTimeX = rotateX.keyTime(rotateX.nearestKeyIndex(comp.time))
          if (numKeyY != 0) var nearestKeyTimeY = rotateY.keyTime(rotateY.nearestKeyIndex(comp.time))
          if (numKeyZ != 0) var nearestKeyTimeZ = rotateZ.keyTime(rotateZ.nearestKeyIndex(comp.time))
          if ((xbox.value && !selectedLater.threeDLayer) || (ybox.value && !selectedLater.threeDLayer)) selectedLater.threeDLayer = true
          // X
          if (xbox.value) {
            if (numKeyX == 0) {
              var value = rotateX.value
              rotateX.setValue(value + parseInt(amount.text) * (generateRandomNumber() * 2 - 1))
            } else if (nearestKeyTimeX - comp.time != 0 || keyState.ctrlKey) {
              var value = rotateX.valueAtTime(comp.time, true)
              rotateX.setValueAtTime(comp.time, value + parseInt(amount.text) * (generateRandomNumber() * 2 - 1))
            } else {
              for (var j = 1; j <= numKeyX; j++) {
                var value = rotateX.valueAtTime(rotateX.keyTime(j), true)
                rotateX.setValueAtTime(rotateX.keyTime(j), value + parseInt(amount.text) * (generateRandomNumber() * 2 - 1))
              }
            }
          }
          // Y
          if (ybox.value) {
            if (numKeyY == 0) {
              var value = rotateY.value
              rotateY.setValue(value + parseInt(amount.text) * (generateRandomNumber() * 2 - 1))
            } else if (nearestKeyTimeY - comp.time != 0 || keyState.ctrlKey) {
              var value = rotateY.valueAtTime(comp.time, true)
              rotateY.setValueAtTime(comp.time, value + parseInt(amount.text) * (generateRandomNumber() * 2 - 1))
            } else {
              for (var j = 1; j <= numKeyY; j++) {
                var value = rotateY.valueAtTime(rotateY.keyTime(j), true)
                rotateY.setValueAtTime(rotateY.keyTime(j), value + parseInt(amount.text) * (generateRandomNumber() * 2 - 1))
              }
            }
          }
          // Z
          if (zbox.value) {
            if (numKeyZ == 0) {
              var value = rotateZ.value
              rotateZ.setValue(value + parseInt(amount.text) * (generateRandomNumber() * 2 - 1))
            } else if (nearestKeyTimeZ - comp.time != 0 || keyState.ctrlKey) {
              var value = rotateZ.valueAtTime(comp.time, true)
              rotateZ.setValueAtTime(comp.time, value + parseInt(amount.text) * (generateRandomNumber() * 2 - 1))
            } else {
              for (var j = 1; j <= numKeyZ; j++) {
                var value = rotateZ.valueAtTime(rotateZ.keyTime(j), true)
                rotateZ.setValueAtTime(rotateZ.keyTime(j), value + parseInt(amount.text) * (generateRandomNumber() * 2 - 1))
              }
            }
          }
        }
      } else {
        // scale
        var X = 0
        var Y = 0
        var Z = 0
        if (xboxScale.value) X = 1
        if (yboxScale.value) Y = 1
        if (zboxScale.value) Z = 1
        if (fixed.value == false) {
          // 固定じゃない場合
          for (var i = 0; i < selectedLayers.length; i++) {
            var selectedLater = selectedLayers[i]
            var scale = selectedLater.property('ADBE Transform Group').property('ADBE Scale')
            var numKey = scale.numKeys
            if (numKey != 0) var nearestKeyTime = scale.keyTime(scale.nearestKeyIndex(comp.time))
            if (numKey == 0) {
              var value = scale.value
              scale.setValue([value[0] + parseInt(amount.text) * X * (generateRandomNumber() * 2 - 1),
              value[1] + parseInt(amount.text) * Y * (generateRandomNumber() * 2 - 1), value[2] + parseInt(amount.text) * Z * (generateRandomNumber() * 2 - 1)])
            } else if (nearestKeyTime - comp.time != 0 || keyState.ctrlKey) {
              var value = scale.valueAtTime(comp.time, true)
              scale.setValueAtTime(comp.time, [value[0] + parseInt(amount.text) * X * (generateRandomNumber() * 2 - 1),
              value[1] + parseInt(amount.text) * Y * (generateRandomNumber() * 2 - 1), value[2] + parseInt(amount.text) * Z * (generateRandomNumber() * 2 - 1)])
            } else {
              for (var j = 1; j <= numKey; j++) {
                var value = scale.valueAtTime(scale.keyTime(j), true)
                scale.setValueAtTime(scale.keyTime(j), [value[0] + parseInt(amount.text) * X * (generateRandomNumber() * 2 - 1),
                value[1] + parseInt(amount.text) * Y * (generateRandomNumber() * 2 - 1), value[2] + parseInt(amount.text) * Z * (generateRandomNumber() * 2 - 1)])
              }
            }
          }
        } else {
          // Fixed(固定)の場合
          for (var i = 0; i < selectedLayers.length; i++) {
            var selectedLater = selectedLayers[i]
            var scale = selectedLater.property('ADBE Transform Group').property('ADBE Scale')
            var numKey = scale.numKeys
            if (numKey != 0) var nearestKeyTime = scale.keyTime(scale.nearestKeyIndex(comp.time))
            var randomNum = parseInt(amount.text) * (generateRandomNumber() * 2 - 1)
            if (numKey == 0) {
              var value = scale.value
              scale.setValue([value[0] + randomNum, value[1] + randomNum, value[2] + randomNum])
            } else if (nearestKeyTime - comp.time != 0 || keyState.ctrlKey) {
              var value = scale.valueAtTime(comp.time, true)
              scale.setValueAtTime(comp.time, [value[0] + randomNum, value[1] + randomNum, value[2] + randomNum])
            } else {
              for (var j = 1; j <= numKey; j++) {
                var value = scale.valueAtTime(scale.keyTime(j), true)
                scale.setValueAtTime(scale.keyTime(j), [value[0] + randomNum, value[1] + randomNum, value[2] + randomNum])
              }
            }
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