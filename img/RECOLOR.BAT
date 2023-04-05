setlocal enableDelayedExpansion

set "color0=rgb(198.75,211.25,203.75)"
set "color1=rgb(142.5,167.5,152.5)"
set "color2=rgb(86.25,123.75,101.25)"
set "color3=rgb(30,80,50)"

type "ground.svg"|repl "#000000" "!color0!" >ground_0.svg
type "ground.svg"|repl "#000000" "!color1!" >ground_1.svg
type "ground.svg"|repl "#000000" "!color2!" >ground_2.svg
type "ground.svg"|repl "#000000" "!color3!" >ground_3.svg

for /l %%x in (1, 1, 8) do (
	set "num=%%x"
	type "tree_"!num!".svg"|repl "#000000" "!color0!" >"tree_"!num!"_0.svg"
	type "tree_"!num!".svg"|repl "#000000" "!color1!" >"tree_"!num!"_1.svg"
	type "tree_"!num!".svg"|repl "#000000" "!color2!" >"tree_"!num!"_2.svg"
	type "tree_"!num!".svg"|repl "#000000" "!color3!" >"tree_"!num!"_3.svg"
)
