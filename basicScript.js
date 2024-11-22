// Function to get commit messages in the new branch that don't exist in the current branch
async function getCommitMessages(owner, repo, currentBranch, newBranch, token) {
    const url = `https://api.github.com/repos/${owner}/${repo}/compare/${currentBranch}...${newBranch}`;
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json' // Ensure we get JSON response
        }
    });

    // Check if the response was successful
    if (!response.ok) {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        return [];
    }

    // Parse the JSON response
    const comparisonData = await response.json();
    
    // If no commits are returned, log a message and return an empty array
    if (comparisonData.status !== 'identical' && comparisonData.commits.length > 0) {
        // Extract commit messages from the response
        const commitMessages = comparisonData.commits.map(commit => commit.commit.message);
        return commitMessages;
    } else {
        console.log('No commits found in the new branch that are not in the current branch.');
        return [];
    }
}

// Usage
const owner = 'myusername';  // Replace with the owner of the repo
const repo = 'my-repo';      // Replace with the repository name
const currentBranch = 'main'; // The current branch
const newBranch = 'feature'; // The new branch
const token = 'your_github_personal_access_token';  // Your GitHub personal access token

// Call the function and log the result
getCommitMessages(owner, repo, currentBranch, newBranch, token)
    .then(commitMessages => {
        if (commitMessages.length > 0) {
            console.log("Commit Messages in new branch but not in current branch:");
            commitMessages.forEach(msg => {
                console.log(`- ${msg}`);
            });
        }
    })
    .catch(err => {
        console.error('Error fetching commit messages:', err);
    });
