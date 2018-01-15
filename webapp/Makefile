# Tools

YARN   ?= yarn

# Variables
DIST    := ./build
DATE    ?= $(shell date -u +"%Y-%m-%dT%H:%M:%SZ")
VERSION ?= $(shell git describe --tags --always --dirty --match=v* 2>/dev/null | sed 's/^v//' || \
			cat $(CURDIR)/../.version 2> /dev/null || echo 0.0.0-unreleased)

# Build

.PHONY: all
all: js

$(DIST): ; $(info creating dist path ...) @
	mkdir_p $(DIST)

.PHONY: js
js: vendor | $(DIST) ; $(info building Webapp plugin ...)    @
	@rm -rf build

	@BUILD_VERSION=$(VERSION) BUILD_DATE=$(DATE) $(YARN) webpack -p --env.prod --display-error-details --verbose --progress

.PHONY: js-dev
js-dev: vendor | $(DIST) ; $(info building and watching Webapp plugin ...)    @
	@BUILD_VERSION=$(VERSION) BUILD_DATE=$(DATE) $(YARN) webpack --env --display-error-details --verbose --progress --watch

# Helpers

.PHONY: lint
lint: vendor | $(BASE) ; $(info running Webapp  eslint ...)	@
	$(YARN) eslint .

# Yarn

.PHONY: vendor
vendor: .yarninstall

.yarninstall: package.json ; $(info getting depdencies with yarn ...)   @
	@$(YARN) install --silent
	@touch $@

.PHONY: clean
clean: ; $(info cleaning identifier Webapp ...)  @
	@$(YARN) cache clean

	@rm -rf $(DIST)
	@rm -rf node_modules
	@rm -f .yarninstall

.PHONY: version
version:
	@echo $(VERSION)
