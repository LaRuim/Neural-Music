{ echo "Scanning makefiles for \`pkg-config\` mentions..."
  echo
  PKGS=$( sed 's/#.*$//' Makefile* | sed -n 's/^.*pkg-config  *[^ ]*  *\([^ ]*\) *[^ ] .*$/\1/p' | sort | uniq )
  echo "\`Pkg-config\`s mentioned: \`" $PKGS "\`"
  echo
  echo "Querying this local machine's \`pkg-config\` for library names to search during compilation.  Lines below are its output, specific to your distribution, that you might want to check."
  echo
  LIBS=$( for PKG in $PKGS
          do { pkg-config --libs  $PKG 2>&1 1>&3 | sed 's/^/    /' 1>&2; } 3>&1  | sed -e 's/^-l//' -e 's/ -l/ /g'
          done )
  echo
  echo "Finished querying \`pkg-config\`.  Compile-time libraries available on your Debian:"
  echo
  echo "$LIBS" | sed 's/^/* /'
  echo
  echo "Now querying Debian's \`apt-file\` tool (assuming it is locally installed) to find suggestions of Debian packages necessary to build this software."
  echo
  DEBS=$( { for LIB in $LIBS
            do apt-file find --regexp "/lib${LIB}.so$" & true
            done
          } | sed -n 's/^\([^:]*-dev\):.*$/\1/p' | sort | uniq )
  echo
  echo "Done querying \`apt-file\`.  Here's a suggested command line:"
  echo
  echo "    sudo apt-get install" $DEBS
  echo
  echo "Try installing packages with the command line above, then check \`Makefile\`s and possibly try \`make\`.  There might be some missing packages, hope this little script helped you."
}
