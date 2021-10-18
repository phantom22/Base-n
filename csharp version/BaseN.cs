using System;
using System.Numerics;
using System.Collections.Generic;

#nullable enable
/// <summary>
/// A static class that provides a variety of functions to encrypt/decrypt messages. All methods return strings.
/// </summary>
static class BaseN {
    /// <summary>
    /// Helper methods for the BaseN class
    /// </summary>
    private class Methods {
        public static int Reduce(List<int> list) {
            int cumulative = 0;
            for (int i = 0; i < list.Count; i++) {
                cumulative += list[i];
            }
            return cumulative;
        }
        public static BigInteger Pow(BigInteger a, int b) {
            BigInteger cumulative = 1;
            for (int i = 0; i < b; i++) {
                cumulative = cumulative * a;
            }
            return cumulative;
        }
        public static string SplitRegex(string input, int substringLength) {
            string output = "";
            for (int i = 0; i < input.Length; i+=substringLength) {
                output += input.Substring(i,Math.Min(input.Length-i,substringLength))[0];
            }
            return output;
        }
        public static string[] Set(string[] array) {
            List<string> unique = new List<string>();
            for (int i = 0; i < array.Length; i++) {
                if (!unique.Contains(array[i])) {
                    unique.Add(array[i]);
                }
            }
            return unique.ToArray();
        } 
    }
    /// <summary>
    /// Encrypts a message, given a key and two charsets.
    /// </summary>
    /// <param name="charset1">Must include all symbols used in both msg and key. String of non repeating characters.</param>
    /// <param name="charset2">String of non repeating characters.</param>
    public static string Encrypt(string msg, string key, string charset1, string charset2) {
        
        BigInteger OldBase = charset1.Length;
        BigInteger NewBase = charset2.Length;
        BigInteger RelativeNumber = 0;
        int NewMagnitude = 0;
        string EncryptedMsg = "";
        List<int> rotors = new List<int>();
        // 1. calc relative msg number and key number, calculated in reverse: "531" would be read as 135
        for (int i = 0; i < msg.Length; i++) {
            RelativeNumber += Methods.Pow(OldBase, msg.Length - 1 - i) * (BigInteger)(charset1.IndexOf(msg[i]));
        }
        for (int i = key.Length - 1; i >= 0; i--) {
            int index = charset1.IndexOf(key[i]);
            RelativeNumber += Methods.Pow(OldBase, i) * index;
            rotors.Add(index);
        }
        if (RelativeNumber < 0) {
            return "";
        }
        // 2. now calc the max magnitude of the relative number in the new base
        while (Methods.Pow(NewBase,NewMagnitude) <= RelativeNumber && Methods.Pow(NewBase,(NewMagnitude + 1)) < RelativeNumber) {
            NewMagnitude = NewMagnitude + 1;
        }
        // 3. encrypt msg by subtracting from the relative number, starting from the highest magnitude:
        while (NewMagnitude >= 0) {
            for (BigInteger characterStep = 0; characterStep < NewBase; characterStep++) {
                BigInteger magnitudeStep = Methods.Pow(NewBase,NewMagnitude);
                BigInteger step = magnitudeStep * characterStep;
                if (step <= RelativeNumber && step + magnitudeStep > RelativeNumber) {
                    int character = (int)((characterStep + Methods.Reduce(rotors)) % NewBase);
                    RelativeNumber -= step;
                    EncryptedMsg += charset2[character];
                    // rotor logic
                    for (int i = 0; i < rotors.Count; i++) {
                        rotors[i] += 1;
                        if (rotors[i] >= (int)OldBase) {
                            rotors[i] = 0;
                        }
                        else {
                            break;
                        }
                    }
                }
            }
            NewMagnitude--;
        }
        return EncryptedMsg;
    }
    /// <summary>
    /// Decrypts a message, given a key and two charsets. There order of charset1 and charset2 needs to be swapped in order to correctly decode the original message.
    /// </summary>
    /// <returns></returns>
    public static string Decrypt(string msg, string key, string charset1, string charset2) {
        BigInteger OldBase = charset1.Length;
        BigInteger NewBase = charset2.Length;
        BigInteger RelativeNumber = 0;
        int NewMagnitude = 0;
        string DecryptedMsg = "";
        List<int> rotors = new List<int>();
        // 1. calc relative key number (calculated in reverse: "531" would be read as 135)
        for (int i = key.Length - 1; i >= 0; i--) {
            int index = charset2.IndexOf(key[i]);
            RelativeNumber -= Methods.Pow(NewBase,i) * (BigInteger)index;
            rotors.Add(index);
        }
        // 2. find newMsg, by applying inverse rotor logic
        for (int i = 0; i < msg.Length; i++) {
            BigInteger relativeIndex = Methods.Reduce(rotors) + charset1.IndexOf(msg[i]);
            for (int a = 2; a < OldBase; a++) {
                relativeIndex -= charset1.IndexOf(msg[a]) * OldBase - Methods.Reduce(rotors);
            }
            // rotor logic
            for (int b = 0; b < rotors.Count; b++) {
                rotors[b] += 1;
                if (rotors[b] >= NewBase) {
                    rotors[b] = 0;
                }
                else {
                    break;
                }
            }
            // 3. calc relative newMsg number
            RelativeNumber += Methods.Pow(OldBase,msg.Length - 1 - i) * (relativeIndex % OldBase);
        }
        if (RelativeNumber < 0) {
            return "";
        }
        // 4. now calc the max magnitude of the relative number in the new base
        while (Methods.Pow(NewBase,NewMagnitude) <= RelativeNumber && Methods.Pow(NewBase,(NewMagnitude + 1)) <= RelativeNumber) {
            NewMagnitude = NewMagnitude + 1;
        }
        // 5. decrypt newMsg by subtracting from the relative number, starting from the highest magnitude
        while (NewMagnitude >= 0) {
            for (BigInteger characterStep = 0; characterStep < NewBase; characterStep++) {
                BigInteger magnitudeStep = Methods.Pow(NewBase,NewMagnitude);
                BigInteger step = magnitudeStep * characterStep;
                if (step <= RelativeNumber && step + magnitudeStep > RelativeNumber) {
                    RelativeNumber -= step;
                    DecryptedMsg += charset2[(int)characterStep];
                }
            }
            NewMagnitude--;
        }
        return DecryptedMsg;
    }
    /// <summary>
    /// Returns all characters contained in msg, without duplicates.
    /// </summary>
    public static string ExtractCharset(string msg) {
        string result = "";
        for (int i = 0; i < msg.Length; i++) {
            if (result.Contains(msg[i])) { 
                continue; 
            }
            result += msg[i];
        }
        return result;
    }
    /// <summary>
    /// Returns a safe charset for both the msg and key.
    /// </summary>
    /// <param name="substringLength">Needed only if the created charset is going to be used in <c>.EncryptSubstrings()/.DecryptSubstrings()</c>. Affects only <c>msg</c></param>
    /// <exception>ArgumentException: sometimes, given a <c>substringLength</c> and a long <c>msg</c>, it's impossible to create a safe charset.</exception>
    public static string CharsetFromMsgAndKey(string msg, string key, int substringLength = 0) {
        return BaseN.ExtractAndRandomize(BaseN.ExtractCharset(msg + key), substringLength);
    }
    /// <summary>
    /// This function extracts the charset of the message and shuffles it randomly.
    /// It attempts to shuffle it in a way no substring of <c>msg</c> will start with the first letter of the charset.
    /// </summary>
    /// <param name="msg"></param>
    /// <param name="substringLength">If equal to <c>0</c> the input will be treated as a whole word.</param>
    /// <exception cref="ArgumentException"></exception>
    public static string ExtractAndRandomize(string msg, int substringLength = 0) {
        string firstLetters = substringLength == 0 ? "" : BaseN.ExtractCharset(Methods.SplitRegex(msg, substringLength));
        string charset = BaseN.ExtractCharset(msg);
        string testCharset = charset; 
        string result = ""; 
        int maxIterations = charset.Length;
        var rand = new Random();
        while (charset.Length != maxIterations - 1) {
            int r = (int)(rand.NextDouble() * testCharset.Length);
            if (substringLength == 0 && msg[0] == testCharset[r] || firstLetters.Contains(testCharset[r])) {
                testCharset = testCharset.Substring(0, r) + testCharset.Substring(r + 1);
                continue;
            }
            else if (testCharset.Length == 0) {
                throw new ArgumentException("Impossible to create a safe charset with provided parameters");
            }
            int index = charset.IndexOf(testCharset[r]);
            result += charset[index];
            charset = charset.Substring(0, index) + charset.Substring(index + 1);
        }
        while (result.Length != maxIterations) {
            int r = (int)(rand.NextDouble() * charset.Length);
            result += charset[r];
            charset = charset.Substring(0,r) + charset.Substring(r + 1);
        }
        return result;
    }
    /// <summary>
    /// works exactly like <c>.Encrypt()</c> but treats the input as segments, given a valid <c>substringLength</c> value.
    /// </summary>
    /// <param name="substringLength">length of each segment</param>
    /// <param name="inBetween">a serie of strings that stitches the substrings together.</param>
    /// <exception cref="ArgumentException"></exception>
    /// <returns></returns>
    public static string EncryptSubstrings(string msg, string key, string charset1, string charset2, int substringLength, string[]? inBetween = null) {
        inBetween = inBetween ?? new string[0];
        if (substringLength < 2) {
            throw new ArgumentException("substringLength must be >= 2");
        }
        string result = "";
        for (int i = 0; i < msg.Length; i += substringLength) {
            result += BaseN.Encrypt(msg.Substring(i, Math.Min(msg.Length - i,substringLength)), key, charset1, charset2);
            if (i + substringLength < msg.Length) {
                result += inBetween[i % inBetween.Length];
            }
        }
        return result;
    }
    /// <summary>
    /// works exactly like <c>.Decrypt()<c> but treats the input as segments.
    /// </summary>
    /// <param name="inBetween">S serie of strings that stitches the substrings together. Needed to properly split the <c>msg</c></param>
    /// <returns></returns>
    public static string DecryptSubstrings(string msg, string key, string charset1, string charset2, string[]? inBetween = null) {
        inBetween = inBetween ?? new string[0];
        const string placeholder = "{{{{{{SPLIT--POINT}}}}}}";
        List<string> cuts;
        string result = "";
        inBetween = Methods.Set(inBetween);
        for (int i = 0; i < inBetween.Length; i++) {
            msg = msg.Replace(inBetween[i], placeholder);
        }
        cuts = new List<string>(msg.Split(placeholder, StringSplitOptions.RemoveEmptyEntries));
        for (int i = 0; i < cuts.Count; i++) {
            result += BaseN.Decrypt(cuts[i], key, charset1, charset2);
        }
        return result;
    }
}