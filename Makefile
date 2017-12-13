PACKAGE  = stash.kopano.io/km/mattermost-plugin-kopanowebmeetings
PACKAGE_NAME = kopano-$(shell basename $(PACKAGE))

# Variables
PWD     := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))
DATE    ?= $(shell date -u +"%Y-%m-%dT%H:%M:%SZ")
VERSION ?= $(shell git describe --tags --always --dirty --match=v* 2>/dev/null | sed 's/^v//' || \
			cat $(CURDIR)/.version 2> /dev/null || echo 0.0.0-unreleased)

# Build

.PHONY: all
all: webapp

.PHONY: webapp
webapp:
	$(MAKE) -C webapp build

# Dist

.PHONY: dist
dist: webapp/build/kopanowebmeetings_bundle.js plugin.json ; $(info building dist tarball ...)
	@mkdir -p "dist/${PACKAGE_NAME}-${VERSION}"
	@cd dist && \
	cp -avf ../LICENSE.txt "${PACKAGE_NAME}-${VERSION}" && \
	cp -avf ../AGPL-3 "${PACKAGE_NAME}-${VERSION}" && \
	cp -avf ../README.md "${PACKAGE_NAME}-${VERSION}" && \
	cp -avr ../webapp/build "${PACKAGE_NAME}-${VERSION}/webapp" && \
	cp -avr ../plugin.json "${PACKAGE_NAME}-${VERSION}" && \
	tar --owner=0 --group=0 -czvf ${PACKAGE_NAME}-${VERSION}.tar.gz "${PACKAGE_NAME}-${VERSION}" && \
	cd ..

# Rest

.PHONY: clean
clean: ; $(info cleaning ...)	@
	@rm -rf $(GOPATH)
	@rm -rf bin
	@rm -rf test/test.*
	@$(MAKE) -C webapp clean

.PHONY: version
version:
	@echo $(VERSION)
