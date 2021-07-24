import spacy
nlp=spacy.load('en_core_web_sm')
print(nlp.pipe_names)
import pandas as pd
from spacy.training.example import Example


df = pd.read_csv('Data.csv')
sent = df['Sentence'].to_list()
prod = df['Product'].to_list()

def subs_str_finder(control_s, sub_str):

    sub_len = len(sub_str)

    while sub_str in control_s:
        first_index = control_s.find(sub_str)
        second_index = first_index + sub_len
        yield first_index, second_index

        control_s = control_s.replace(sub_str, "", 1)



# Getting the pipeline component
ner=nlp.get_pipe("ner")

TRAIN_DATA = []
for se,po in zip(sent,prod):
    for i,j in subs_str_finder(se.lower(), po.lower()):
        temp = []
        temp.append(se)
        temp.append({"entities": [(i,j, "PRODUCT")]})
    TRAIN_DATA.append(tuple(temp))


print(type(TRAIN_DATA[0]))

# Adding labels to the `ner`

for _, annotations in TRAIN_DATA:
  for ent in annotations.get("entities"):
    ner.add_label(ent[2])

pi_exceptions = ["ner", "trf_wordpiecer", "trf_tok2vec"]
unaffected_pi = [pipe for pipe in nlp.pipe_names if pipe not in pi_exceptions]

import random
from spacy.util import minibatch, compounding
from pathlib import Path

with nlp.disable_pipes(*unaffected_pi):

  for iteration in range(50):

    random.shuffle(TRAIN_DATA)
    losses = {}
    batches = minibatch(TRAIN_DATA, size=compounding(4.0, 32.0, 1.001))
    for batch in batches:
        texts, annotations = zip(*batch)
        for texts, annotations in batch:
          doc = nlp.make_doc(texts)
          example = Example.from_dict(doc, annotations)
          nlp.update(
                      [example],
                      drop=0.5,  
                      losses=losses,
                  )
          print("Losses", losses)


output_dir = Path('../Test/')
nlp.to_disk(output_dir)
