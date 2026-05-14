class BuiltPet:
    def __init__(self):
        self.name = input("Name your pet: ")
        self.species = input("Choose a species name for your pet: ")
        self.hunger = 5
        self.mood = None

    def feed(self):
        if self.hunger <= 0:
            self.hunger = 0
        else:
            self.hunger -= 1
        
    def play(self):
        self.hunger += 1 
        
    def check_mood(self):
        if self.hunger <= 2:
            self.mood = "Happy"
        elif self.hunger <= 6:
            self.mood = "Okay"
        else:
            self.mood = "Grumpy"
        
    def stats(self):
        self.check_mood()
        print("Pet Name: ", self.name)
        print("Pet Species: ", self.species)
        print("Pet Hunger: ", self.hunger)
        print("Pet Mood: ", self.mood)


pet = BuiltPet()
pet.stats()