import subprocess

def getPowerState():
    # Parse output to find display state
    output = subprocess.check_output('ioreg -w 0 -c IODisplayWrangler -r IODisplayWrangler'.split())
    i = output.decode("utf-8").find("DevicePowerState")
    state = int(output[i+18:i+19])
    return state == 4
