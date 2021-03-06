# Kirikiri SDL2

This is a ported version of [Kirikiri Z](https://krkrz.github.io/) that can be run on platforms supporting [SDL2](https://www.libsdl.org/), such as macOS and Linux.  
This program can be used alongside a modified version of KAG (Kirikiri Adventure Game) 3. For more details, please see the following location: https://github.com/uyjulian/kag3  
A demonstration project playable in your web browser thanks to Kirikiri SDL2 being compiled to [WebAssembly](https://webassembly.org/) with [Emscripten](https://emscripten.org/) is available here: https://ghpages.uyjulian.pw/krkrsdl2/  

## Cloning

To clone the repository, please use the following command in a terminal:

```bash
git clone --recursive https://github.com/uyjulian/krkrsdl2
```
If you do not use the exact command above, you will be missing files since the project uses Git submodules.

## Building

This project can be built by using the Meson build system. For more information about the system, please visit the following location: https://mesonbuild.com/  
Meson toolchain files can be used to cross compile to different platforms, such as when using [Emscripten](https://emscripten.org/).  
For your convenience, Meson toolchain files are located here: https://github.com/uyjulian/meson_toolchains  

## Running

Once you have built this project, change directory to one containing `startup.tjs`.  
After that is done, execute the program: `/path/to/krkrsdl2`  

## Original project

Code from this project is based on the following projects:
* [Kirikiri 2](https://github.com/krkrz/krkr2)
* [Kirikiri Z](https://github.com/krkrz/krkrz) dev_multi_platform branch
* [KAGParser](https://github.com/krkrz/KAGParser)
* [SamplePlugin](https://github.com/krkrz/SamplePlugin)
* [binaryStream](https://github.com/wtnbgo/binaryStream)
* [csvParser](https://github.com/wtnbgo/csvParser)
* [fftgraph](https://github.com/krkrz/fftgraph)
* [fstat](https://github.com/wtnbgo/fstat)
* [getSample](https://github.com/wtnbgo/getSample)
* [json](https://github.com/wtnbgo/json)
* [krglhwebp](https://github.com/uyjulian/krglhwebp)
* [kwidgets](https://github.com/krkrz/kwidgets)
* [layerExAreaAverage](https://github.com/wtnbgo/layerExAreaAverage)
* [layerExBTOA](https://github.com/wtnbgo/layerExBTOA)
* [layerExDraw](https://github.com/wtnbgo/layerExDraw)
* [layerExImage](https://github.com/wtnbgo/layerExImage)
* [layerExLongExposure](https://github.com/wtnbgo/layerExLongExposure)
* [layerExRaster](https://github.com/wtnbgo/layerExRaster)
* [layerEx](https://github.com/wtnbgo/layerEx)
* [lineParser](https://github.com/wtnbgo/lineParser)
* [ncbind](https://github.com/wtnbgo/ncbind)
* [saveStruct](https://github.com/wtnbgo/saveStruct)
* [scriptsEx](https://github.com/wtnbgo/scriptsEx)
* [shrinkCopy](https://github.com/wtnbgo/shrinkCopy)
* [varFile](https://github.com/wtnbgo/varFile)
* [wuvorbis](https://github.com/krkrz/wuvorbis)

## IRC Channel

Members of the Kirikiri SDL2 project can be found in the [#krkrsdl2 channel on freenode](https://webchat.freenode.net/?channel=#krkrsdl2).

## License

This code is based on a modified 3-clause BSD license. Please read `LICENSE` for more information.  
This project contains third-party components. Please view the license file in each component for more information.
