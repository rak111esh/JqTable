<?php
sleep (rand(0,3));
for ($j=0; $j<4; $j++){
   echo "<tr class='level_1_row'>";
   echo "<td>SubRowc ".$j."</td>";
   for ($i=0 ; $i<21; $i++){
      echo "<td>".rand(100,150)."\$U</td>";
   }
   echo "<td>".rand(1,99)."%</td>";
   echo "</tr>";
}
?>
