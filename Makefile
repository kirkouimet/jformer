DIRS=php scripts

all:
	for dir in $(DIRS); do \
		$(MAKE) -C $$dir; \
	done
