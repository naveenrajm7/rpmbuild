# GitHub Action - RPM Build  

This GitHub Action builds RPMs from spec file and using repository contents as source (wraps the rpmbuild utility).
Integrates easily with GitHub actions to allow RPMS to be uploaded as Artifact (actions/upload-artifact) or as Release Asset (actions/upload-release-asset).


## Usage
### Pre-requisites
Create a workflow `.yml` file in your repositories `.github/workflows` directory. An [example workflow](#example-workflow---build-rpm) is available below. For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file). 

This generated RPMS and SRPMS can be used in two ways.
1. Upload as build artifact
    You can use GitHub Action [`@actions/upload-artifact`](https://www.github.com/actions/upload-artifact)
2. Upload as Release assest 
    If you want to upload as release asset ,You also will need to have a release to upload your asset to, which could be created programmatically by [`@actions/create-release`](https://www.github.com/actions/create-release) as show in the example workflow.

### Inputs

- `spec_file`: The path to the spec file in your repo. `**require**`

### Outputs

- `rpm_dir_path`: path to RPMS directory
- `source_rpm_path`: path to Source RPM file
- `source_rpm_dir_path`: path to  SRPMS directory
- `source_rpm_name`: name of Source RPM file
- `rpm_content_type`: Content-type for RPM Upload


### Example workflow - build RPM

Basic:
```yaml
name: RPM Build
on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2

    - name: build RPM package
      id: rpm
      uses: naveenrajm7/rpmbuild@master
      with:
        spec_file: "cello.spec"

    - name: Upload artifact
      uses: actions/upload-artifact@v1.0.0
      with:
        name: Source RPM
        path: ${{ steps.rpm.outputs.source_rpm_path }}
```

## License

The scripts and documentation in this project are released under the [GNU GPLv3](LICENSE)