
  var Module = typeof Module !== 'undefined' ? Module : {};
  
  if (!Module.expectedDataFileDownloads) {
    Module.expectedDataFileDownloads = 0;
  }
  Module.expectedDataFileDownloads++;
  (function() {
   var loadPackage = function(metadata) {
  
      var PACKAGE_PATH;
      if (typeof window === 'object') {
        PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
      } else if (typeof location !== 'undefined') {
        // worker
        PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
      } else {
        throw 'using preloaded data can only be done on a web page or in a web worker';
      }
      var PACKAGE_NAME = 'data.data';
      var REMOTE_PACKAGE_BASE = 'data.data';
      if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
        Module['locateFile'] = Module['locateFilePackage'];
        err('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
      }
      var REMOTE_PACKAGE_NAME = Module['locateFile'] ? Module['locateFile'](REMOTE_PACKAGE_BASE, '') : REMOTE_PACKAGE_BASE;
    
      var REMOTE_PACKAGE_SIZE = metadata['remote_package_size'];
      var PACKAGE_UUID = metadata['package_uuid'];
    
      function fetchRemotePackage(packageName, packageSize, callback, errback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', packageName, true);
        xhr.responseType = 'arraybuffer';
        xhr.onprogress = function(event) {
          var url = packageName;
          var size = packageSize;
          if (event.total) size = event.total;
          if (event.loaded) {
            if (!xhr.addedTotal) {
              xhr.addedTotal = true;
              if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
              Module.dataFileDownloads[url] = {
                loaded: event.loaded,
                total: size
              };
            } else {
              Module.dataFileDownloads[url].loaded = event.loaded;
            }
            var total = 0;
            var loaded = 0;
            var num = 0;
            for (var download in Module.dataFileDownloads) {
            var data = Module.dataFileDownloads[download];
              total += data.total;
              loaded += data.loaded;
              num++;
            }
            total = Math.ceil(total * Module.expectedDataFileDownloads/num);
            if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
          } else if (!Module.dataFileDownloads) {
            if (Module['setStatus']) Module['setStatus']('Downloading data...');
          }
        };
        xhr.onerror = function(event) {
          throw new Error("NetworkError for: " + packageName);
        }
        xhr.onload = function(event) {
          if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            var packageData = xhr.response;
            callback(packageData);
          } else {
            throw new Error(xhr.statusText + " : " + xhr.responseURL);
          }
        };
        xhr.send(null);
      };

      function handleError(error) {
        console.error('package error:', error);
      };
    
        var fetchedCallback = null;
        var fetched = Module['getPreloadedPackage'] ? Module['getPreloadedPackage'](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE) : null;

        if (!fetched) fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
          if (fetchedCallback) {
            fetchedCallback(data);
            fetchedCallback = null;
          } else {
            fetched = data;
          }
        }, handleError);
      
    function runWithFS() {
  
      function assert(check, msg) {
        if (!check) throw msg + new Error().stack;
      }
  Module['FS_createPath']('/', 'video', true, true);
Module['FS_createPath']('/', 'fgimage', true, true);
Module['FS_createPath']('/', 'bgimage', true, true);
Module['FS_createPath']('/', 'others', true, true);
Module['FS_createPath']('/', 'image', true, true);
Module['FS_createPath']('/', 'rule', true, true);
Module['FS_createPath']('/', 'system', true, true);
Module['FS_createPath']('/', 'scenario', true, true);
Module['FS_createPath']('/', 'bgm', true, true);
Module['FS_createPath']('/', 'sound', true, true);

      /** @constructor */
      function DataRequest(start, end, audio) {
        this.start = start;
        this.end = end;
        this.audio = audio;
      }
      DataRequest.prototype = {
        requests: {},
        open: function(mode, name) {
          this.name = name;
          this.requests[name] = this;
          Module['addRunDependency']('fp ' + this.name);
        },
        send: function() {},
        onload: function() {
          var byteArray = this.byteArray.subarray(this.start, this.end);
          this.finish(byteArray);
        },
        finish: function(byteArray) {
          var that = this;
  
          Module['FS_createDataFile'](this.name, null, byteArray, true, true, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
          Module['removeRunDependency']('fp ' + that.name);
  
          this.requests[this.name] = null;
        }
      };
  
          var files = metadata['files'];
          for (var i = 0; i < files.length; ++i) {
            new DataRequest(files[i]['start'], files[i]['end'], files[i]['audio']).open('GET', files[i]['filename']);
          }
  
    
      function processPackageData(arrayBuffer) {
        assert(arrayBuffer, 'Loading data file failed.');
        assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
        var byteArray = new Uint8Array(arrayBuffer);
        var curr;
        
          // copy the entire loaded file into a spot in the heap. Files will refer to slices in that. They cannot be freed though
          // (we may be allocating before malloc is ready, during startup).
          var ptr = Module['getMemory'](byteArray.length);
          Module['HEAPU8'].set(byteArray, ptr);
          DataRequest.prototype.byteArray = Module['HEAPU8'].subarray(ptr, ptr+byteArray.length);
    
            var files = metadata['files'];
            for (var i = 0; i < files.length; ++i) {
              DataRequest.prototype.requests[files[i].filename].onload();
            }
                Module['removeRunDependency']('datafile_data.data');

      };
      Module['addRunDependency']('datafile_data.data');
    
      if (!Module.preloadResults) Module.preloadResults = {};
    
        Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
        if (fetched) {
          processPackageData(fetched);
          fetched = null;
        } else {
          fetchedCallback = processPackageData;
        }
      
    }
    if (Module['calledRun']) {
      runWithFS();
    } else {
      if (!Module['preRun']) Module['preRun'] = [];
      Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
    }
  
   }
   loadPackage({"files": [{"filename": "/.DS_Store", "start": 0, "end": 14340, "audio": 0}, {"filename": "/font.otf", "start": 14340, "end": 4687248, "audio": 0}, {"filename": "/startup.tjs", "start": 4687248, "end": 4687854, "audio": 0}, {"filename": "/MenuItem_stub.tjs", "start": 4687854, "end": 4688275, "audio": 0}, {"filename": "/video/\uff5e\u3053\u306e\u30d5\u30a1\u30a4\u30eb\u306f\u524a\u9664\u3057\u3066\u304b\u307e\u3044\u307e\u305b\u3093\uff5e.txt", "start": 4688275, "end": 4688329, "audio": 0}, {"filename": "/fgimage/uni.jpg", "start": 4688329, "end": 4727940, "audio": 0}, {"filename": "/fgimage/\uff5e\u3053\u306e\u30d5\u30a1\u30a4\u30eb\u306f\u524a\u9664\u3057\u3066\u304b\u307e\u3044\u307e\u305b\u3093\uff5e.txt", "start": 4727940, "end": 4727994, "audio": 0}, {"filename": "/fgimage/uni_m.jpg", "start": 4727994, "end": 4751587, "audio": 0}, {"filename": "/bgimage/_24.jpg", "start": 4751587, "end": 4812021, "audio": 0}, {"filename": "/bgimage/\uff5e\u3053\u306e\u30d5\u30a1\u30a4\u30eb\u306f\u524a\u9664\u3057\u3066\u304b\u307e\u3044\u307e\u305b\u3093\uff5e.txt", "start": 4812021, "end": 4812075, "audio": 0}, {"filename": "/bgimage/_24_2.jpg", "start": 4812075, "end": 4863909, "audio": 0}, {"filename": "/bgimage/_24_3.jpg", "start": 4863909, "end": 4904208, "audio": 0}, {"filename": "/bgimage/_24_4.jpg", "start": 4904208, "end": 4939996, "audio": 0}, {"filename": "/bgimage/_24_5.jpg", "start": 4939996, "end": 4994784, "audio": 0}, {"filename": "/others/\uff5e\u3053\u306e\u30d5\u30a1\u30a4\u30eb\u306f\u524a\u9664\u3057\u3066\u304b\u307e\u3044\u307e\u305b\u3093\uff5e.txt", "start": 4994784, "end": 4994838, "audio": 0}, {"filename": "/image/ExQuestion.png", "start": 4994838, "end": 4995362, "audio": 0}, {"filename": "/image/\uff5e\u3053\u306e\u30d5\u30a1\u30a4\u30eb\u306f\u524a\u9664\u3057\u3066\u304b\u307e\u3044\u307e\u305b\u3093\uff5e.txt", "start": 4995362, "end": 4995416, "audio": 0}, {"filename": "/image/messageframe.tlg", "start": 4995416, "end": 4996338, "audio": 0}, {"filename": "/image/snow_4.png", "start": 4996338, "end": 4996619, "audio": 0}, {"filename": "/image/snow_1.png", "start": 4996619, "end": 4996777, "audio": 0}, {"filename": "/image/snow_0.png", "start": 4996777, "end": 4996901, "audio": 0}, {"filename": "/image/snow_2.png", "start": 4996901, "end": 4997100, "audio": 0}, {"filename": "/image/snow_3.png", "start": 4997100, "end": 4997339, "audio": 0}, {"filename": "/rule/nami.png", "start": 4997339, "end": 5050833, "audio": 0}, {"filename": "/rule/trans1.png", "start": 5050833, "end": 5053961, "audio": 0}, {"filename": "/rule/\uff5e\u3053\u306e\u30d5\u30a1\u30a4\u30eb\u306f\u524a\u9664\u3057\u3066\u304b\u307e\u3044\u307e\u305b\u3093\uff5e.txt", "start": 5053961, "end": 5054015, "audio": 0}, {"filename": "/system/SE.tjs", "start": 5054015, "end": 5060538, "audio": 0}, {"filename": "/system/MessageLayer.tjs", "start": 5060538, "end": 5140193, "audio": 0}, {"filename": "/system/check.png", "start": 5140193, "end": 5140337, "audio": 0}, {"filename": "/system/BGM.tjs", "start": 5140337, "end": 5153937, "audio": 0}, {"filename": "/system/Config.tjs", "start": 5153937, "end": 5184561, "audio": 0}, {"filename": "/system/AnimationLayer.tjs", "start": 5184561, "end": 5220215, "audio": 0}, {"filename": "/system/Plugin.tjs", "start": 5220215, "end": 5223265, "audio": 0}, {"filename": "/system/YesNoDialog.tjs", "start": 5223265, "end": 5227708, "audio": 0}, {"filename": "/system/MainWindow.tjs", "start": 5227708, "end": 5386557, "audio": 0}, {"filename": "/system/LineBreak.asd", "start": 5386557, "end": 5387131, "audio": 0}, {"filename": "/system/HistoryLayer.tjs", "start": 5387131, "end": 5411592, "audio": 0}, {"filename": "/system/UpdateConfig.tjs", "start": 5411592, "end": 5414754, "audio": 0}, {"filename": "/system/CheckBoxLayer.tjs", "start": 5414754, "end": 5419618, "audio": 0}, {"filename": "/system/Movie.tjs", "start": 5419618, "end": 5426586, "audio": 0}, {"filename": "/system/LineBreak_a.png", "start": 5426586, "end": 5428558, "audio": 0}, {"filename": "/system/LineBreak.png", "start": 5428558, "end": 5428639, "audio": 0}, {"filename": "/system/PageBreak.png", "start": 5428639, "end": 5428720, "audio": 0}, {"filename": "/system/Initialize.tjs", "start": 5428720, "end": 5436623, "audio": 0}, {"filename": "/system/GraphicLayer.tjs", "start": 5436623, "end": 5452687, "audio": 0}, {"filename": "/system/Utils.tjs", "start": 5452687, "end": 5456446, "audio": 0}, {"filename": "/system/PageBreak_a.png", "start": 5456446, "end": 5458214, "audio": 0}, {"filename": "/system/EditLayer.tjs", "start": 5458214, "end": 5474344, "audio": 0}, {"filename": "/system/PageBreak.asd", "start": 5474344, "end": 5474918, "audio": 0}, {"filename": "/system/DefaultMover.tjs", "start": 5474918, "end": 5482648, "audio": 0}, {"filename": "/system/Conductor.tjs", "start": 5482648, "end": 5494789, "audio": 0}, {"filename": "/system/KAGLayer.tjs", "start": 5494789, "end": 5509357, "audio": 0}, {"filename": "/system/ButtonLayer.tjs", "start": 5509357, "end": 5517183, "audio": 0}, {"filename": "/system/Menus.tjs", "start": 5517183, "end": 5525405, "audio": 0}, {"filename": "/scenario/.DS_Store", "start": 5525405, "end": 5531553, "audio": 0}, {"filename": "/scenario/first.ks", "start": 5531553, "end": 5579351, "audio": 0}, {"filename": "/scenario/snow.ks", "start": 5579351, "end": 5590483, "audio": 0}, {"filename": "/bgm/.DS_Store", "start": 5590483, "end": 5596631, "audio": 0}, {"filename": "/bgm/\uff5e\u3053\u306e\u30d5\u30a1\u30a4\u30eb\u306f\u524a\u9664\u3057\u3066\u304b\u307e\u3044\u307e\u305b\u3093\uff5e.txt", "start": 5596631, "end": 5596685, "audio": 0}, {"filename": "/sound/\uff5e\u3053\u306e\u30d5\u30a1\u30a4\u30eb\u306f\u524a\u9664\u3057\u3066\u304b\u307e\u3044\u307e\u305b\u3093\uff5e.txt", "start": 5596685, "end": 5596739, "audio": 0}], "remote_package_size": 5596739, "package_uuid": "7685c428-69b5-49a1-ae47-8bb452490d4f"});
  
  })();
  