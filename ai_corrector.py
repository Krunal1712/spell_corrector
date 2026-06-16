from textblob import TextBlob

# 1. User ka galat spelling wala text
galat_text = "I am a goood computr programer"

# 2. TextBlob object create karna
blob = TextBlob(galat_text)

# 3. Text ko correct karna
sahi_text = blob.correct()

# 4. Print karke dekhna
print("Galat Text  :", galat_text)
print("Sahi Text   :", str(sahi_text))
