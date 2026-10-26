"""Create a sorted ZIP with fixed timestamps and permissions (no host metadata)."""
import pathlib
import sys
import zipfile

source, destination = map(pathlib.Path, sys.argv[1:])
with zipfile.ZipFile(destination, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for path in sorted(source.rglob('*')):
        if path.is_symlink():
            raise ValueError(f'Symlinks are not release inputs: {path}')
        if path.is_file():
            info = zipfile.ZipInfo(path.relative_to(source.parent).as_posix(), (2026, 1, 1, 0, 0, 0))
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            archive.writestr(info, path.read_bytes(), compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)
