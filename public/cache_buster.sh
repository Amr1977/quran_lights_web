old_timestamp=$(cat timestamp.txt)
current_timestamp=$(date +%s)

sed -i -e "s/$old_timestamp/$current_timestamp/g" *.html

echo "$current_timestamp" >timestamp.txt
echo "updated time stamp to be $current_timestamp"