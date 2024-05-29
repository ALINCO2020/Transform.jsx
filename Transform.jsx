function main(thisObj) {
  var dataPath = Folder.decode(Folder.userData) + '/Aescripts/Transform';
  var f = new Folder(dataPath);
  if (!f.exists) f.create();
  
  function fileExist(filename) {
    var file = new File(dataPath + "/" + filename + ".txt");
    return file.exists
  }
  
  function writeFile(object, filename) {
    var myFile = new File(dataPath + "/" + filename + ".txt");
    myFile.open("w");
    myFile.encoding = "UTF-8";
    myFile.write(JSON.stringify(object));
    myFile.close();
  }
  
  function readFile(filename) {
    var file = new File(dataPath + "/" + filename + ".txt");
    file.open('r');
    file.encoding = 'UTF-8';
    return JSON.parse(file.readln());
  }
  
  var settings;
  function makeSettings() {
    settings = {
      'position_amount': '',
      'position_x': false,
      'position_y': false,
      'position_z': false,
      'rotate_amount': '',
      'rotate_x': false,
      'rotate_y': false,
      'rotate_z': false,
      'scale_amount': '',
      'scale_x': false,
      'scale_y': false,
      'scale_z': false,
      'scale_fixed': true,
    }
    writeFile(settings, 'settings')
  }
  if (!fileExist('settings')) {
    makeSettings()
  } else {
    try {
      settings = readFile('settings')
    } catch (e) {
      makeSettings()
    }
  }

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
  xbox.value = settings['position_x']

  var ybox = group2.add("checkbox", undefined, undefined, { name: "checkbox2" });
  ybox.text = "Y";
  ybox.value = settings['position_y']

  var zbox = group2.add("checkbox", undefined, undefined, { name: "checkbox3" });
  zbox.text = "Z";
  zbox.value = settings['position_z']

  var group2Rotate = group2top.add("group", undefined, { name: "group2" });
  group2Rotate.orientation = "row";
  group2Rotate.alignChildren = ["left", "center"];
  group2Rotate.spacing = 10;
  group2Rotate.margins = 0;
  group2Rotate.visible = false

  var xboxRotate = group2Rotate.add("checkbox", undefined, undefined, { name: "checkbox1" });
  xboxRotate.text = "X";
  xboxRotate.value = settings['rotate_x']

  var yboxRotate = group2Rotate.add("checkbox", undefined, undefined, { name: "checkbox2" });
  yboxRotate.text = "Y";
  yboxRotate.value = settings['rotate_y']

  var zboxRotate = group2Rotate.add("checkbox", undefined, undefined, { name: "checkbox3" });
  zboxRotate.text = "Z";
  zboxRotate.value = settings['rotate_z']

  var group2Scale = group2top.add("group", undefined, { name: "group2" });
  group2Scale.orientation = "row";
  group2Scale.alignChildren = ["left", "center"];
  group2Scale.spacing = 10;
  group2Scale.margins = 0;
  group2Scale.visible = false

  var xboxScale = group2Scale.add("checkbox", undefined, undefined, { name: "checkbox1" });
  xboxScale.text = "X";
  xboxScale.enabled = false
  xboxScale.value = settings['scale_x']

  var yboxScale = group2Scale.add("checkbox", undefined, undefined, { name: "checkbox2" });
  yboxScale.text = "Y";
  yboxScale.enabled = false
  yboxScale.value = settings['scale_y']

  var zboxScale = group2Scale.add("checkbox", undefined, undefined, { name: "checkbox3" });
  zboxScale.text = "Z";
  zboxScale.enabled = false
  zboxScale.value = settings['scale_z']

  var fixed = group2Scale.add('checkbox', undefined, 'Fixed')
  fixed.value = true
  fixed.value = settings['scale_fixed']

  // GROUP3
  // ======
  var group3 = win.add("group", undefined, { name: "group3" });
  group3.orientation = "row";
  group3.alignChildren = ["left", "center"];
  group3.spacing = 10;
  group3.margins = 0;

  var statictext = group3.add("statictext", undefined, undefined, { name: "statictext1" });
  statictext.text = "Amount";

  var amountGroup = group3.add('group')
  amountGroup.orientation = 'stack'

  var amountP = amountGroup.add('edittext {properties: {name: "amount"}}');
  amountP.preferredSize.width = 69;
  amountP.text = settings['position_amount']

  var amountR = amountGroup.add('edittext {properties: {name: "amount"}}');
  amountR.preferredSize.width = 69;
  amountR.visible = false
  amountR.text = settings['rotate_amount']

  var amountS = amountGroup.add('edittext {properties: {name: "amount"}}');
  amountS.preferredSize.width = 69;
  amountS.visible = false
  amountS.text = settings['scale_amount']

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
    group2Rotate.visible = false
    group2Scale.visible = false
    amountP.visible = true
    amountR.visible = false
    amountS.visible = false
  }

  rotateBtn.onClick = function () {
    group2.visible = false
    group2Rotate.visible = true
    group2Scale.visible = false
    amountP.visible = false
    amountR.visible = true
    amountS.visible = false
  }

  scaleBtn.onClick = function () {
    group2.visible = false
    group2Rotate.visible = false
    group2Scale.visible = true
    amountP.visible = false
    amountR.visible = false
    amountS.visible = true
  }

  win.onResize = function () {
    win.layout.resize();
  }

  win.layout.layout();

  amountP.onChanging = function () {
    settings['position_amount'] = amountP.text
    writeFile(settings, 'settings')
  }

  amountR.onChanging = function () {
    settings['rotate_amount'] = amountR.text
    writeFile(settings, 'settings')
  }

  amountS.onChanging = function () {
    settings['scale_amount'] = amountS.text
    writeFile(settings, 'settings')
  }

  xbox.onClick = function () {
    settings['position_x'] = xbox.value
    writeFile(settings, 'settings')
  }

  ybox.onClick = function () {
    settings['position_y'] = ybox.value
    writeFile(settings, 'settings')
  }

  zbox.onClick = function () {
    settings['position_z'] = zbox.value
    writeFile(settings, 'settings')
  }

  xboxRotate.onClick = function () {
    settings['rotate_x'] = xboxRotate.value
    writeFile(settings, 'settings')
  }

  yboxRotate.onClick = function () {
    settings['rotate_y'] = yboxRotate.value
    writeFile(settings, 'settings')
  }

  zboxRotate.onClick = function () {
    settings['rotate_z'] = zboxRotate.value
    writeFile(settings, 'settings')
  }

  xboxScale.onClick = function () {
    settings['scale_x'] = xboxScale.value
    writeFile(settings, 'settings')
  }

  yboxScale.onClick = function () {
    settings['scale_y'] = yboxScale.value
    writeFile(settings, 'settings')
  }

  zboxScale.onClick = function () {
    settings['scale_z'] = zboxScale.value
    writeFile(settings, 'settings')
  }

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
    settings['scale_fixed'] = fixed.value
    writeFile(settings, 'settings')
  }

  /**
 * ポジションを設定する関数
 * @param {*} layer レイヤー
 * @param {*} XYarray 配列[x, y, z]
 * @param {boolean} isSetValueAtTime setValueAtTimeを使うかどうか
 * @param {*} time setValueAtTimeを使う場合の時間
 */
  function setPosition(layer, XYZarray, isSetValueAtTime, time) {
    try {
      var x = XYZarray[0]
      var y = XYZarray[1]
      var z = XYZarray[2]
      var position = layer.property('ADBE Transform Group').property('ADBE Position')
      // setValueを使う場合
      if (!isSetValueAtTime) {
        // 次元分割されていない場合
        if (!position.dimensionsSeparated) {
          position.setValue([x, y, z])
        } else {// 次元分割されている場合
          layer.property("ADBE Transform Group").property("ADBE Position_0").setValue(x)
          layer.property("ADBE Transform Group").property("ADBE Position_1").setValue(y)
          if (layer.threeDLayer) {
            layer.property("ADBE Transform Group").property("ADBE Position_2").setValue(z)
          }
        }
      } else {// setValueAtTimeを使う場合
        // 次元分割されていない場合
        if (!position.dimensionsSeparated) {
          position.setValueAtTime(time, [x, y, z])
        } else {// 次元分割されている場合
          layer.property("ADBE Transform Group").property("ADBE Position_0").setValueAtTime(time, x)
          layer.property("ADBE Transform Group").property("ADBE Position_1").setValueAtTime(time, y)
          if (layer.threeDLayer) {
            layer.property("ADBE Transform Group").property("ADBE Position_2").setValueAtTime(time, z)
          }

        }
      }
    } catch (e) {
      alert(e.message + e.line)
    }
  }

  sequence.onClick = function () {
    app.beginUndoGroup("sequence");
    try {
      var keyState = ScriptUI.environment.keyboardState;
      // Altクリックなら数字反転
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
      for (var i = 0; i < selectedLayers.length; i++) {
        var selectedLayer = selectedLayers[i]
        // Shiftクリックなら全部同じだけずらす
        if (keyState.shiftKey) {
          var tmp_i = 1
        } else {
          var tmp_i = i
        }
        if (positionBtn.value) {
          // position
          var position = selectedLayer.property('ADBE Transform Group').property('ADBE Position')
          if (zbox.value && !selectedLayer.threeDLayer) selectedLayer.threeDLayer = true

          if (!position.dimensionsSeparated) {// 次元分割されていない場合
            var numKey = position.numKeys
            if (numKey != 0) var nearestKeyTime = position.keyTime(position.nearestKeyIndex(comp.time))
            // キーフレームがない場合
            if (numKey == 0) {
              var value = position.value
              setPosition(selectedLayer, [
                value[0] + Number(amountP.text) * X * tmp_i * alt,
                value[1] + Number(amountP.text) * Y * tmp_i * alt,
                value[2] + Number(amountP.text) * Z * tmp_i * alt], false)
              // ctrlクリックならすべてのキーフレームを更新しない
            } else if (nearestKeyTime - comp.time != 0 || (keyState.ctrlKey || keyState.metaKey)) {
              var value = position.valueAtTime(comp.time, true)
              setPosition(selectedLayer, [
                value[0] + Number(amountP.text) * X * tmp_i * alt,
                value[1] + Number(amountP.text) * Y * tmp_i * alt,
                value[2] + Number(amountP.text) * Z * tmp_i * alt], true, comp.time)
              // 全てのキーフレームを更新
            } else {
              for (var j = 1; j <= numKey; j++) {
                var value = position.valueAtTime(position.keyTime(j), true)
                setPosition(selectedLayer, [
                  value[0] + Number(amountP.text) * X * tmp_i * alt,
                  value[1] + Number(amountP.text) * Y * tmp_i * alt,
                  value[2] + Number(amountP.text) * Z * tmp_i * alt], true, position.keyTime(j))
              }
            }
          } else {// 次元分割されている場合 意味分かんねえええええええええええええええええええうおおおおおおおおおおおおおおおおおおおおおおおおおおお
            var positions = []
            var numKeys = []
            var nearestKeyTimes = []
            for (var j = 0; j < 3; j++) {
              positions.push(selectedLayer.property('ADBE Transform Group').property('ADBE Position_' + String(j)))
              numKeys.push(positions[j].numKeys)
              if (numKeys[j] != 0) {
                nearestKeyTimes.push(positions[j].keyTime(positions[j].nearestKeyIndex(comp.time)))
              }
            }
            // キーフレームがない場合
            if (numKeys[0] == 0) {
              setPosition(selectedLayer, [
                positions[0].value + Number(amountP.text) * X * tmp_i * alt,
                positions[1].value + Number(amountP.text) * Y * tmp_i * alt,
                positions[2].value + Number(amountP.text) * Z * tmp_i * alt], false)
              // ctrlクリックならすべてのキーフレームを更新しない
            } else if (nearestKeyTimes[0] - comp.time != 0 || (keyState.ctrlKey || keyState.metaKey)) {
              if (selectedLayer.threeDLayer) {
                var XYZarray = [
                  positions[0].valueAtTime(comp.time, true) + Number(amountP.text) * X * tmp_i * alt,
                  positions[1].valueAtTime(comp.time, true) + Number(amountP.text) * Y * tmp_i * alt,
                  positions[2].valueAtTime(comp.time, true) + Number(amountP.text) * Z * tmp_i * alt]
              } else {
                var XYZarray = [
                  positions[0].valueAtTime(comp.time, true) + Number(amountP.text) * X * tmp_i * alt,
                  positions[1].valueAtTime(comp.time, true) + Number(amountP.text) * Y * tmp_i * alt]
              }
              setPosition(selectedLayer, XYZarray, true, comp.time)
              // 全てのキーフレームを更新
            } else {
              for (var k = 1; k <= numKeys[0]; k++) {
                if (selectedLayer.threeDLayer) {
                  var XYZarray = [
                    positions[0].valueAtTime(positions[0].keyTime(k), true) + Number(amountP.text) * X * tmp_i * alt,
                    positions[1].valueAtTime(positions[1].keyTime(k), true) + Number(amountP.text) * Y * tmp_i * alt,
                    positions[2].valueAtTime(positions[2].keyTime(k), true) + Number(amountP.text) * Z * tmp_i * alt]
                } else {
                  var XYZarray = [
                    positions[0].valueAtTime(positions[0].keyTime(k), true) + Number(amountP.text) * X * tmp_i * alt,
                    positions[1].valueAtTime(positions[1].keyTime(k), true) + Number(amountP.text) * Y * tmp_i * alt]
                }
                setPosition(selectedLayer, XYZarray, true, positions[0].keyTime(k))
              }
            }
          }
        } else if (rotateBtn.value) {
          // rotate
          var rotateX = selectedLayer.property('ADBE Transform Group').property('ADBE Rotate X')
          var rotateY = selectedLayer.property('ADBE Transform Group').property('ADBE Rotate Y')
          var rotateZ = selectedLayer.property('ADBE Transform Group').property('ADBE Rotate Z')
          var numKeyX = rotateX.numKeys
          var numKeyY = rotateY.numKeys
          var numKeyZ = rotateZ.numKeys
          if (numKeyX != 0) var nearestKeyTimeX = rotateX.keyTime(rotateX.nearestKeyIndex(comp.time))
          if (numKeyY != 0) var nearestKeyTimeY = rotateY.keyTime(rotateY.nearestKeyIndex(comp.time))
          if (numKeyZ != 0) var nearestKeyTimeZ = rotateZ.keyTime(rotateZ.nearestKeyIndex(comp.time))
          if ((xboxRotate.value && !selectedLayer.threeDLayer) || (yboxRotate.value && !selectedLayer.threeDLayer)) selectedLayer.threeDLayer = true
          // X
          if (xboxRotate.value) {
            if (numKeyX == 0) {
              var value = rotateX.value
              rotateX.setValue(value + Number(amountR.text) * tmp_i * alt)
            } else if (nearestKeyTimeX - comp.time != 0 || (keyState.ctrlKey || keyState.metaKey)) {
              var value = rotateX.valueAtTime(comp.time, true)
              rotateX.setValueAtTime(comp.time, value + Number(amountR.text) * tmp_i * alt)
            } else {
              for (var j = 1; j <= numKeyX; j++) {
                var value = rotateX.valueAtTime(rotateX.keyTime(j), true)
                rotateX.setValueAtTime(rotateX.keyTime(j), value + Number(amountR.text) * tmp_i * alt)
              }
            }
          }
          // Y
          if (yboxRotate.value) {
            if (numKeyY == 0) {
              var value = rotateY.value
              rotateY.setValue(value + Number(amountR.text) * tmp_i * alt)
            } else if (nearestKeyTimeY - comp.time != 0 || (keyState.ctrlKey || keyState.metaKey)) {
              var value = rotateY.valueAtTime(comp.time, true)
              rotateY.setValueAtTime(comp.time, value + Number(amountR.text) * tmp_i * alt)
            } else {
              for (var j = 1; j <= numKeyY; j++) {
                var value = rotateY.valueAtTime(rotateY.keyTime(j), true)
                rotateY.setValueAtTime(rotateY.keyTime(j), value + Number(amountR.text) * tmp_i * alt)
              }
            }
          }
          // Z
          if (zboxRotate.value) {
            if (numKeyZ == 0) {
              var value = rotateZ.value
              rotateZ.setValue(value + Number(amountR.text) * tmp_i * alt)
            } else if (nearestKeyTimeZ - comp.time != 0 || (keyState.ctrlKey || keyState.metaKey)) {
              var value = rotateZ.valueAtTime(comp.time, true)
              rotateZ.setValueAtTime(comp.time, value + Number(amountR.text) * tmp_i * alt)
            } else {
              for (var j = 1; j <= numKeyZ; j++) {
                var value = rotateZ.valueAtTime(rotateZ.keyTime(j), true)
                rotateZ.setValueAtTime(rotateZ.keyTime(j), value + Number(amountR.text) * tmp_i * alt)
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
            var scale = selectedLayer.property('ADBE Transform Group').property('ADBE Scale')
            var numKey = scale.numKeys
            if (numKey != 0) var nearestKeyTime = scale.keyTime(scale.nearestKeyIndex(comp.time))
            if (numKey == 0) {
              var value = scale.value
              scale.setValue([value[0] + Number(amountS.text) * X * tmp_i * alt,
              value[1] + Number(amountS.text) * Y * tmp_i * alt, value[2] + Number(amountS.text) * Z * tmp_i * alt])
            } else if (nearestKeyTime - comp.time != 0 || (keyState.ctrlKey || keyState.metaKey)) {
              var value = scale.valueAtTime(comp.time, true)
              scale.setValueAtTime(comp.time, [value[0] + Number(amountS.text) * X * tmp_i * alt,
              value[1] + Number(amountS.text) * Y * tmp_i * alt, value[2] + Number(amountS.text) * Z * tmp_i * alt])
            } else {
              for (var j = 1; j <= numKey; j++) {
                var value = scale.valueAtTime(scale.keyTime(j), true)
                scale.setValueAtTime(scale.keyTime(j), [value[0] + Number(amountS.text) * X * tmp_i * alt,
                value[1] + Number(amountS.text) * Y * tmp_i * alt, value[2] + Number(amountS.text) * Z * tmp_i * alt])
              }
            }
          } else {
            // Fixed(固定)の場合
            var selectedLayer = selectedLayers[i]
            var scale = selectedLayer.property('ADBE Transform Group').property('ADBE Scale')
            var numKey = scale.numKeys
            if (numKey != 0) var nearestKeyTime = scale.keyTime(scale.nearestKeyIndex(comp.time))
            if (numKey == 0) {
              var value = scale.value
              scale.setValue([value[0] + Number(amountS.text) * tmp_i * alt,
              value[1] + Number(amountS.text) * tmp_i * alt, value[2] + Number(amountS.text) * tmp_i * alt])
            } else if (nearestKeyTime - comp.time != 0 || (keyState.ctrlKey || keyState.metaKey)) {
              var value = scale.valueAtTime(comp.time, true)
              scale.setValueAtTime(comp.time, [value[0] + Number(amountS.text) * tmp_i * alt,
              value[1] + Number(amountS.text) * tmp_i * alt, value[2] + Number(amountS.text) * tmp_i * alt])
            } else {
              for (var j = 1; j <= numKey; j++) {
                var value = scale.valueAtTime(scale.keyTime(j), true)
                scale.setValueAtTime(scale.keyTime(j), [value[0] + Number(amountS.text) * tmp_i * alt,
                value[1] + Number(amountS.text) * tmp_i * alt, value[2] + Number(amountS.text) * tmp_i * alt])
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
    app.beginUndoGroup("randomise");
    try {
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
          var selectedLayer = selectedLayers[i]
          var position = selectedLayer.property('ADBE Transform Group').property('ADBE Position')
          var numKey = position.numKeys
          if (numKey != 0) var nearestKeyTime = position.keyTime(position.nearestKeyIndex(comp.time))
          if (zbox.value && !selectedLayer.threeDLayer) selectedLayer.threeDLayer = true
          var randX = generateRandomNumber() * 2 - 1
          var randY = generateRandomNumber() * 2 - 1
          var randZ = generateRandomNumber() * 2 - 1
          if (!position.dimensionsSeparated) {
            // 次元分割されていない場合
            if (numKey == 0) {
              var value = position.value
              position.setValue([value[0] + Number(amountP.text) * X * randX,
              value[1] + Number(amountP.text) * Y * randY, value[2] + Number(amountP.text) * Z * randZ])
            } else if (nearestKeyTime - comp.time != 0 || (keyState.ctrlKey || keyState.metaKey)) {
              var value = position.valueAtTime(comp.time, true)
              position.setValueAtTime(comp.time, [value[0] + Number(amountP.text) * X * randX,
              value[1] + Number(amountP.text) * Y * randY, value[2] + Number(amountP.text) * Z * randZ])
            } else {
              for (var j = 1; j <= numKey; j++) {
                var value = position.valueAtTime(position.keyTime(j), true)
                position.setValueAtTime(position.keyTime(j), [value[0] + Number(amountP.text) * X * randX,
                value[1] + Number(amountP.text) * Y * randY, value[2] + Number(amountP.text) * Z * randZ])
              }
            }
          } else {
            // 次元分割されている場合
            if (numKey == 0) {
              var value = []
              value.push(selectedLayer.property("ADBE Transform Group").property("ADBE Position_0").value)
              value.push(selectedLayer.property("ADBE Transform Group").property("ADBE Position_1").value)
              value.push(selectedLayer.property("ADBE Transform Group").property("ADBE Position_2").value)
              selectedLayer.property("ADBE Transform Group").property("ADBE Position_0").setValue(value[0] + Number(amountP.text) * X * randX)
              selectedLayer.property("ADBE Transform Group").property("ADBE Position_1").setValue(value[1] + Number(amountP.text) * Y * randY)
              if (selectedLayer.threeDLayer) {
                selectedLayer.property("ADBE Transform Group").property("ADBE Position_2").setValue(value[2] + Number(amountP.text) * Z * randZ)
              }
            } else if (nearestKeyTime - comp.time != 0 || (keyState.ctrlKey || keyState.metaKey)) {
              var value = []
              value.push(selectedLayer.property("ADBE Transform Group").property("ADBE Position_0").valueAtTime(comp.time, true))
              value.push(selectedLayer.property("ADBE Transform Group").property("ADBE Position_1").valueAtTime(comp.time, true))
              value.push(selectedLayer.property("ADBE Transform Group").property("ADBE Position_2").valueAtTime(comp.time, true))
              selectedLayer.property("ADBE Transform Group").property("ADBE Position_0").setValueAtTime(comp.time, value[0] + Number(amountP.text) * X * randX)
              selectedLayer.property("ADBE Transform Group").property("ADBE Position_1").setValueAtTime(comp.time, value[1] + Number(amountP.text) * Y * randY)
              if (selectedLayer.threeDLayer) {
                selectedLayer.property("ADBE Transform Group").property("ADBE Position_2").setValueAtTime(comp.time, value[2] + Number(amountP.text) * Z * randZ)
              }
            } else {
              for (var j = 1; j <= numKey; j++) {
                var value = []
                value.push(selectedLayer.property("ADBE Transform Group").property("ADBE Position_0").valueAtTime(position.keyTime(j), true))
                value.push(selectedLayer.property("ADBE Transform Group").property("ADBE Position_1").valueAtTime(position.keyTime(j), true))
                value.push(selectedLayer.property("ADBE Transform Group").property("ADBE Position_2").valueAtTime(position.keyTime(j), true))
                selectedLayer.property("ADBE Transform Group").property("ADBE Position_0").setValueAtTime(position.keyTime(j), value[0] + Number(amountP.text) * X * randX)
                selectedLayer.property("ADBE Transform Group").property("ADBE Position_1").setValueAtTime(position.keyTime(j), value[1] + Number(amountP.text) * Y * randY)
                if (selectedLayer.threeDLayer) {
                  selectedLayer.property("ADBE Transform Group").property("ADBE Position_2").setValueAtTime(position.keyTime(j), value[2] + Number(amountP.text) * Z * randZ)
                }
              }
            }
          }
        }
      } else if (rotateBtn.value) {
        // rotate
        for (var i = 0; i < selectedLayers.length; i++) {
          var selectedLayer = selectedLayers[i]
          var rotateX = selectedLayer.property('ADBE Transform Group').property('ADBE Rotate X')
          var rotateY = selectedLayer.property('ADBE Transform Group').property('ADBE Rotate Y')
          var rotateZ = selectedLayer.property('ADBE Transform Group').property('ADBE Rotate Z')
          var numKeyX = rotateX.numKeys
          var numKeyY = rotateY.numKeys
          var numKeyZ = rotateZ.numKeys
          if (numKeyX != 0) var nearestKeyTimeX = rotateX.keyTime(rotateX.nearestKeyIndex(comp.time))
          if (numKeyY != 0) var nearestKeyTimeY = rotateY.keyTime(rotateY.nearestKeyIndex(comp.time))
          if (numKeyZ != 0) var nearestKeyTimeZ = rotateZ.keyTime(rotateZ.nearestKeyIndex(comp.time))
          if ((xboxRotate.value && !selectedLayer.threeDLayer) || (yboxRotate.value && !selectedLayer.threeDLayer)) selectedLayer.threeDLayer = true
          // X
          if (xboxRotate.value) {
            if (numKeyX == 0) {
              var value = rotateX.value
              rotateX.setValue(value + Number(amountR.text) * (generateRandomNumber() * 2 - 1))
            } else if (nearestKeyTimeX - comp.time != 0 || (keyState.ctrlKey || keyState.metaKey)) {
              var value = rotateX.valueAtTime(comp.time, true)
              rotateX.setValueAtTime(comp.time, value + Number(amountR.text) * (generateRandomNumber() * 2 - 1))
            } else {
              for (var j = 1; j <= numKeyX; j++) {
                var value = rotateX.valueAtTime(rotateX.keyTime(j), true)
                rotateX.setValueAtTime(rotateX.keyTime(j), value + Number(amountR.text) * (generateRandomNumber() * 2 - 1))
              }
            }
          }
          // Y
          if (yboxRotate.value) {
            if (numKeyY == 0) {
              var value = rotateY.value
              rotateY.setValue(value + Number(amountR.text) * (generateRandomNumber() * 2 - 1))
            } else if (nearestKeyTimeY - comp.time != 0 || (keyState.ctrlKey || keyState.metaKey)) {
              var value = rotateY.valueAtTime(comp.time, true)
              rotateY.setValueAtTime(comp.time, value + Number(amountR.text) * (generateRandomNumber() * 2 - 1))
            } else {
              for (var j = 1; j <= numKeyY; j++) {
                var value = rotateY.valueAtTime(rotateY.keyTime(j), true)
                rotateY.setValueAtTime(rotateY.keyTime(j), value + Number(amountR.text) * (generateRandomNumber() * 2 - 1))
              }
            }
          }
          // Z
          if (zboxRotate.value) {
            if (numKeyZ == 0) {
              var value = rotateZ.value
              rotateZ.setValue(value + Number(amountR.text) * (generateRandomNumber() * 2 - 1))
            } else if (nearestKeyTimeZ - comp.time != 0 || (keyState.ctrlKey || keyState.metaKey)) {
              var value = rotateZ.valueAtTime(comp.time, true)
              rotateZ.setValueAtTime(comp.time, value + Number(amountR.text) * (generateRandomNumber() * 2 - 1))
            } else {
              for (var j = 1; j <= numKeyZ; j++) {
                var value = rotateZ.valueAtTime(rotateZ.keyTime(j), true)
                rotateZ.setValueAtTime(rotateZ.keyTime(j), value + Number(amountR.text) * (generateRandomNumber() * 2 - 1))
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
            var selectedLayer = selectedLayers[i]
            var scale = selectedLayer.property('ADBE Transform Group').property('ADBE Scale')
            var numKey = scale.numKeys
            if (numKey != 0) var nearestKeyTime = scale.keyTime(scale.nearestKeyIndex(comp.time))
            if (numKey == 0) {
              var value = scale.value
              scale.setValue([value[0] + Number(amountS.text) * X * (generateRandomNumber() * 2 - 1),
              value[1] + Number(amountS.text) * Y * (generateRandomNumber() * 2 - 1), value[2] + Number(amountS.text) * Z * (generateRandomNumber() * 2 - 1)])
            } else if (nearestKeyTime - comp.time != 0 || (keyState.ctrlKey || keyState.metaKey)) {
              var value = scale.valueAtTime(comp.time, true)
              scale.setValueAtTime(comp.time, [value[0] + Number(amountS.text) * X * (generateRandomNumber() * 2 - 1),
              value[1] + Number(amountS.text) * Y * (generateRandomNumber() * 2 - 1), value[2] + Number(amountS.text) * Z * (generateRandomNumber() * 2 - 1)])
            } else {
              for (var j = 1; j <= numKey; j++) {
                var value = scale.valueAtTime(scale.keyTime(j), true)
                scale.setValueAtTime(scale.keyTime(j), [value[0] + Number(amountS.text) * X * (generateRandomNumber() * 2 - 1),
                value[1] + Number(amountS.text) * Y * (generateRandomNumber() * 2 - 1), value[2] + Number(amountS.text) * Z * (generateRandomNumber() * 2 - 1)])
              }
            }
          }
        } else {
          // Fixed(固定)の場合
          for (var i = 0; i < selectedLayers.length; i++) {
            var selectedLayer = selectedLayers[i]
            var scale = selectedLayer.property('ADBE Transform Group').property('ADBE Scale')
            var numKey = scale.numKeys
            if (numKey != 0) var nearestKeyTime = scale.keyTime(scale.nearestKeyIndex(comp.time))
            var randomNum = Number(amountS.text) * (generateRandomNumber() * 2 - 1)
            if (numKey == 0) {
              var value = scale.value
              scale.setValue([value[0] + randomNum, value[1] + randomNum, value[2] + randomNum])
            } else if (nearestKeyTime - comp.time != 0 || (keyState.ctrlKey || keyState.metaKey)) {
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