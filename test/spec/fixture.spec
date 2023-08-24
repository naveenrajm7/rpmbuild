Name:       fixture
Version:    0.0.1
Release:    1%{?dist}
Summary:    Hello World
License:    GPLv3+
BuildArch:  noarch

%description
Fixture file for tests

%prep

%build

%install
mkdir -p %{buildroot}/%{_bindir}
install -m 0755 %{name} %{buildroot}/%{_bindir}/%{name}

%files
%{_bindir}/%{name}

%changelog
