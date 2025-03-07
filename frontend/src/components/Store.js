import { create } from 'zustand';

const useAuthStore = create((set) => ({
    // Authentication state
    isloggedin: false,
    setIsLoggedIn: (status) => set({ isloggedin: status }),

    // Step management
    stepsItems: ["Category", "Difficulty", "Customise", "Review"],
    currentStep: 1,
    setCurrentStep: (step) => set({ currentStep: step }),
    nextStep: () => set((state) => ({
        currentStep: Math.min(state.currentStep + 1, state.stepsItems.length)
    })),
    prevStep: () => set((state) => ({
        currentStep: Math.max(state.currentStep - 1, 1)
    })),

    // Categories
    categories: [],
    setCategories: (newCategories) => set({ categories: newCategories }), 

    // Difficulty Level
    difficulty: "Medium",
    setDifficulty: (level) => set({ difficulty: level }),

    // Quiz Customization
    optionsCount: 4,
    setOptionsCount: (count) => set({ optionsCount: count }),

    questionCount: 10,
    setQuestionCount: (count) => set({ questionCount: count }),

    timePerQuestion: 60,
    setTimePerQuestion: (time) => set({ timePerQuestion: time }),

}));

export default useAuthStore;