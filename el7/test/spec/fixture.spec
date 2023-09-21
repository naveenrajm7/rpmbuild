Name:       fixture
Version:    0.0.1
Release:    1%{?dist}
Summary:    Hello World
License:    GPLv3+
BuildArch:  noarch
Source0:    %{name}-%{version}.tar.gz

%description
Fixture file for tests

%prep
%setup -c -n %{name} -a 0 -T

%build

%install
mkdir -p %{buildroot}/usr/bin
install -m 0755 %{name}-%{version}/%{name}bin -t %{buildroot}/usr/bin/

%files
%{_bindir}/%{name}bin

%changelog
