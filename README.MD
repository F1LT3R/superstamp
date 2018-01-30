# SuperStamp

CLI tool to append EXIF timestamp or created-date to media file names.

## Installation

```shell
# Run sumperstamp (always requires path as argument)
sumperstamp ./
```

## Usage

```shell
# Run sumperstamp (always requires path as argument)
sumperstamp ./
```

## Example Output

```shell
queueStat: FILE0646.MOV
stat: FILE0646.MOV
queueStat: FILE0647.MOV
stat: FILE0647.MOV
queueStat: FILE0648.MOV
stat: FILE0648.MOV
queueStat: FILE0649.MOV
stat: FILE0649.MOV
Renamed: FILE0646.MOV > 2014-05-15_13-53-20-0000_-0400_FILE0646.MOV
Renamed: FILE0647.MOV > 2014-05-15_14-39-54-0000_-0400_FILE0647.MOV
Renamed: FILE0648.MOV > 2014-05-16_21-32-58-0000_-0400_FILE0648.MOV
Renamed: FILE0649.MOV > 2014-05-16_21-38-40-0000_-0400_FILE0649.MOV
Done!
```


## More Detailed Instructions

```shell
# Install
npm install -g superstamp


# Go find a directory with .jpg, .mov files etc.
cd ~/Desktop/Disc-B

# Get directory listing
ls -Althr

# total 3581824
# -rwxr-xr-x@ 1 al  staff   1.6G Jun 15  2014 FILE0649.MOV
# -rwxr-xr-x@ 1 al  staff   6.3M Jun 15  2014 FILE0648.MOV
# -rwxr-xr-x@ 1 al  staff    65M Jun 15  2014 FILE0647.MOV
# -rwxr-xr-x@ 1 al  staff   5.0M Jun 15  2014 FILE0646.MOV

# Run sumperstamp (always requires path as argument)
sumperstamp ./

# queueStat: FILE0646.MOV
# stat: FILE0646.MOV
# queueStat: FILE0647.MOV
# stat: FILE0647.MOV
# queueStat: FILE0648.MOV
# stat: FILE0648.MOV
# queueStat: FILE0649.MOV
# stat: FILE0649.MOV
# Renamed: FILE0646.MOV > 2014-05-15_13-53-20-0000_-0400_FILE0646.MOV
# Renamed: FILE0647.MOV > 2014-05-15_14-39-54-0000_-0400_FILE0647.MOV
# Renamed: FILE0648.MOV > 2014-05-16_21-32-58-0000_-0400_FILE0648.MOV
# Renamed: FILE0649.MOV > 2014-05-16_21-38-40-0000_-0400_FILE0649.MOV
# Done!

# Get directory listing again to see changes
ls -Althr

# total 3581824
# -rwxr-xr-x@ 1 al  staff   1.6G Jun 15  2014 2014-05-16_21-38-40-0000_-0400_FILE0649.MOV
# -rwxr-xr-x@ 1 al  staff   6.3M Jun 15  2014 2014-05-16_21-32-58-0000_-0400_FILE0648.MOV
# -rwxr-xr-x@ 1 al  staff    65M Jun 15  2014 2014-05-15_14-39-54-0000_-0400_FILE0647.MOV
# -rwxr-xr-x@ 1 al  staff   5.0M Jun 15  2014 2014-05-15_13-53-20-0000_-0400_FILE0646.MOV
```