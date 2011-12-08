<?php
  $reg_number = 3;
?>
 <thead>
  <tr class="rows_title">
    <td>Descripcopn</td>
    <td>Pre1</td>
    <td>Sre1</td>
    <td>Tot1</td>
    <td>Pre2</td>
    <td>Sre2</td>
    <td>Tot2</td>
    <td>Pre3</td>
    <td>Sre3</td>
    <td>Tot3</td>
    <td>Pre4</td>
    <td>Sre4</td>
    <td>Tot4</td>
    <td>Pre5</td>
    <td>Sre5</td>
    <td>Tot5</td>
    <td>ComPreX</td>
    <td>ComPreX</td>
    <td>CompotX</td>
    <td>VarFin</td>
  </tr>
  </thead>
  <tbody>
<?php

for ($i=0; $i<3 ; $i++){
  echo "<tr>";
  echo  "<td>xxxxxxx$i$U</td>";
  echo  "<td>".rand(100,150)."\$U</td>";
  echo  "<td>".rand(100,150)."\$U</td>";
  echo  "<td>".rand(100,150)."\$U</td>";
  echo  "<td>".rand(100,150)."\$U</td>";
  echo  "<td>".rand(100,150)."\$U</td>";
  echo  "<td>".rand(100,150)."\$U</td>";
  echo  "<td>".rand(100,150)."\$U</td>";
  echo  "<td>".rand(100,150)."\$U</td>";
  echo  "<td>".rand(100,150)."\$U</td>";
  echo  "<td>".rand(100,150)."\$U</td>";
  echo  "<td>".rand(100,150)."\$U</td>";
  echo  "<td>".rand(100,150)."\$U</td>";
  echo  "<td>".rand(100,150)."\$U</td>";
  echo  "<td>".rand(100,150)."\$U</td>";
  echo  "<td>".rand(100,150)."\$U</td>";
  echo  "<td>".rand(100,150)."\$U</td>";
  echo  "<td>".rand(100,150)."\$U</td>";
  echo  "<td>".rand(100,150)."\$U</td>";
  echo  "<td>".rand(3,5)."%</td>";
  echo  "</tr>";
  }
?>
  </tbody>