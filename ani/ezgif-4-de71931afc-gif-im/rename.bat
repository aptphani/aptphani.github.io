@echo off
for %%f in (frame_*.gif) do (
    set "filename=%%f"
    setlocal enabledelayedexpansion
    set "newname=!filename:frame_=!"
    set "newname=!newname:_delay-0.08s=!"
    ren "%%f" "!newname!"
    endlocal
)
